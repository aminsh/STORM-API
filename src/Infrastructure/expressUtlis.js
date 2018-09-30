import {injectable, decorate} from "inversify";
import express from "express";
import async from "asyncawait/async";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import flash from "connect-flash";
import compression from "compression";

let controllers = [],
    methods = [],
    noLogs = [],
    noControlPermissions = [];

export function Controller(baseUrl, ...middleware) {
    return function (target) {

        controllers.push({name: target.name, baseUrl, middleware, target});

        decorate(injectable(), target);
    }
}

export function WithoutControlPermissions() {
    return function (target, key) {
        noControlPermissions.push({
            controllerName: target.name || target.constructor.name,
            key,
            isClass: !key
        });
    }
}

export function Get(url, ...middleware) {
    return function (target, key) {

        methods.push({
            controllerName: target.constructor.name,
            method: 'get',
            url,
            key,
            middleware
        });
    }
}

export function Post(url, ...middleware) {
    return function (target, key) {

        methods.push({
            controllerName: target.constructor.name,
            method: 'post',
            url,
            key,
            middleware
        });
    }
}

export function Put(url, ...middleware) {
    return function (target, key) {

        methods.push({
            controllerName: target.constructor.name,
            method: 'put',
            url,
            key,
            middleware
        });
    }
}

export function Delete(url, ...middleware) {
    return function (target, key) {

        methods.push({
            controllerName: target.constructor.name,
            method: 'delete',
            url,
            key,
            middleware
        });
    }
}

export function NoLog() {
    return function (target, key) {
        noLogs.push({controller: target.constructor.name, key});
    }
}

export function register(container, config, setFirstMiddleware, setErrorMiddleware, app = express()) {

    app.use(compression());
    app.use(cors());
    app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(cookieParser());

    if (typeof config === 'function')
        config(app);

    if (typeof setFirstMiddleware === 'function')
        app.use(setFirstMiddleware);

    controllers.forEach(ctrl => {

        let router = express.Router(),

            actions = methods.filter(m => m.controllerName === ctrl.name);

        container.bind(ctrl.name).to(ctrl.target);

        ctrl.middleware.forEach(key => _setMiddlewareForController(key, router));

        actions.forEach(action => {

            action.middleware.forEach(key => _setMiddlewareForAction(router, action, key));

            router.route(action.url)[action.method](async(function (req, res, next) {

                req.controller = ctrl.name;
                req.action = action.key;
                req.noLog = !!noLogs.filter(item => item.controller === ctrl.name && item.key === action.key)[0];
                req.noControlPermissions = !!noControlPermissions.filter(item =>
                    item.isClass
                        ? item.controllerName === ctrl.name
                        : item.controllerName === ctrl.name && item.key === action.key)[0];

                try {
                    _controlUserPermission(req, res, action.method);

                    let result = req.container.get(ctrl.name)[action.key](...arguments);

                    if (!res.headersSent) {

                        if (typeof result !== 'undefined')

                            if (typeof result === 'number')
                                res.json(result);
                            else
                                res.send(result);
                        else
                            res.sendStatus(200);

                        _canLog(req) && req.container.get("LoggerService").success(result);
                    }
                }
                catch (e) {

                    next(e);
                }
            }));

        });

        app.use(ctrl.baseUrl, router);

    });

    if (typeof setErrorMiddleware === 'function')
        app.use(setErrorMiddleware);

    const port = process.env["PORT"];

    app.listen(port, () => console.log(`Port ${port} is listening ...`));
}

function _setMiddlewareForAction(router, action, key) {
    router.route(action.url)[action.method](function (req, res, next) {

        Promise.resolve(req.container.get(key).handler(...arguments))
            .then(() => {

            })
            .catch(error => next(error));
    })
}

function _setMiddlewareForController(key, router) {
    router.use(function (req, res, next) {

        Promise.resolve(req.container.get(key).handler(...arguments))
            .then(() => {

            })
            .catch(error => next(error));
    });
}

function _canLog(req) {

    if (req.method === 'GET')
        return false;

    if (req.noLog)
        return false;

    return true;
}

function _controlUserPermission(req, res, method) {
    console.log(`First, check control permission in console: ${req.noControlPermissions} `);
    if (req.noControlPermissions)
        return;
    if (method !== 'get') {
        let request = _createUrlSubject(req),
            havePermission = req.container.get("UserPermissionsControlService").controlPermission(request);
        console.log(`Second, check control permission in console: ${havePermission} `);
        if (!havePermission)
            throw new ForbiddenException('User do not have permission');
    }
}

function _createUrlSubject(request) {
    let url = request.originalUrl,
        method = request.method,
        fiscalPeriod = request.fiscalPeriodId && '?fiscalPeriodId=' + request.fiscalPeriodId;
    url = url.replace(fiscalPeriod, '');
    method = method === 'POST' ? 'create' : 'PUT' ? 'update' : 'DELETE' ? 'remove' : 'view';
    url = url.substr(url.length - 1) === '/' ? url.substring(0, url.length - 1) : url;

    let paramValue = Object.values(request.params),
        paramValueInUrl = paramValue.asEnumerable().where(param => url.includes(param)).toArray(),
        haveMethod = paramValueInUrl.length > 0 ? !url.includes(paramValueInUrl + '/') : true,
        urlWithoutParam = paramValue.length > 0
            && paramValue.asEnumerable().select(value => url = url.replace('/' + value, '')).first();

    url = urlWithoutParam
        ? urlWithoutParam.substring(4).replaceAll('/', '.')
        : url.substring(4).replaceAll('/', '.');

    method = haveMethod ? '.' + method : '';
    return url + method;
}


