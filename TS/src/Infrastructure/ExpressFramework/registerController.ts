import {Controller, Method, Middleware, Request} from "./Types";
import {interfaces} from "inversify";
import Container = interfaces.Container;
import * as express from "express";
import {methods, noLogs} from "./metadata";
import {parameterDecoratorHandler} from "./ParameterDecoratorHandler";
import * as toAsync from "asyncawait/async";
import * as toResult from "asyncawait/await";

export function registerController(ctrl: Controller, container: Container): express.IRouter<any> {

    const router = express.Router();
    const actions = methods.filter(item => item.controllerName === ctrl.name);

    container.bind(ctrl.name).to(ctrl.target);

    ctrl.middleware.forEach(key => registerMiddleware(key, router));

    actions.forEach(action => registerAction(router, action));

    return router;
}

function registerMiddleware(key: string, router: express.IRouter<any>): void {

    router.use(function (req: Request, res: any, next: express.NextFunction) {
        Promise.resolve(req.container.get<Middleware>(key).handler(...arguments))
            .then(() => {
            })
            .catch(error => next(error));
    })
}

function registerAction(router: express.IRouter<any>, action: Method) {

    action.middleware.forEach(key => registerMiddlewareForAction(router, action, key));

    router.route(action.url)[action.method](toAsync(function (req: Request, res: express.Response, next: express.NextFunction) {
        req.controller = action.controllerName;
        req.action = action.key;
        req.noLog = !!noLogs.filter(item => item.controller === action.controllerName && item.key === action.key)[0];

        try {

            let parameters = parameterDecoratorHandler.getParameters(
                action.controllerName,
                action.key,
                req, res, next);

            if (parameters.length === 0)
                parameters = [req, res, next];

            const result = toResult(Promise.resolve(req.container.get(action.controllerName)[action.key](...parameters)));

            if (typeof result !== 'undefined')

                if (typeof result === 'number')
                    res.json(result);
                else
                    res.send(result);
            else {

                if (action.method === 'get')
                    res.send(result);
                else res.sendStatus(200);
            }

            //canLog(req) && req.container.get("LoggerService").success(result);

        }
        catch (e) {

            console.log(e);

            next(e);
        }
    }));

}

function canLog(req): boolean {

    if (req.method === 'GET')
        return false;

    if (req.noLog)
        return false;

    return true;
}

function registerMiddlewareForAction(router: express.IRouter<any>, action: Method, key: string): void {

    router.route(action.url)[action.method](function (req: Request, res: express.Response, next: express.NextFunction) {

        Promise.resolve(req.container.get<Middleware>(key).handler(req, res, next))
            .then(() => {
            })
            .catch(error => next(error));
    });
}