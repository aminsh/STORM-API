import {Controller, Method, Middleware, Request} from "./Types";
import * as express from "express";
import {methods, noLogs} from "./metadata";
import {parameterDecoratorHandler} from "./ParameterDecoratorHandler";
import {decorate, injectable, interfaces} from "inversify";
import Newable = interfaces.Newable;

export function registerController(ctrl: Controller): express.IRouter<any> {

    decorate(injectable(), ctrl.target);

    const router = express.Router();
    const actions = methods.filter(item => item.controllerName === ctrl.name);

    ctrl.options.middleware.forEach(middleware => registerMiddleware(middleware, router));

    actions.forEach(action => registerAction(router, action));

    return router;
}

function registerMiddleware(middleware: Newable<Middleware>, router: express.IRouter<any>): void {

    router.use(function (req: Request, res: any, next: express.NextFunction) {
        Promise.resolve(req.container.get(middleware).handler(req, res, next))
            .then(() => {
            })
            .catch(error => next(error));
    })
}

function registerAction(router: express.IRouter<any>, action: Method) {

    (action.options || {middleware: []}).middleware.forEach(middleware => registerMiddlewareForAction(router, action, middleware));

    router.route(action.url)[action.method](async function (req: Request, res: express.Response, next: express.NextFunction) {
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

            const result = await Promise.resolve(req.container.get(action.controllerName)[action.key](...parameters));

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
    });

}

function canLog(req): boolean {

    if (req.method === 'GET')
        return false;

    if (req.noLog)
        return false;

    return true;
}

function registerMiddlewareForAction(router: express.IRouter<any>, action: Method, middleware: Newable<Middleware>): void {

    router.route(action.url)[action.method](function (req: Request, res: express.Response, next: express.NextFunction) {
        Promise.resolve(req.container.get<Middleware>(middleware).handler(req, res, next))
            .then(() => {
            })
            .catch(error => next(error));
    });
}