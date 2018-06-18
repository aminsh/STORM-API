import {injectable, decorate} from "inversify";
import express from "express";
import async from "asyncawait/async";

let controllers = [],
    methods = [];

export function Controller(baseUrl, ...middleware) {
    return function (target) {

        controllers.push({name: target.name, baseUrl, middleware, target});

        decorate(injectable(), target);
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

export function register(app = express(), container) {

    controllers.forEach(ctrl => {

        let router = express.Router(),

            actions = methods.filter(m => m.controllerName === ctrl.name);

        container.bind(ctrl.name).to(ctrl.target);

        actions.forEach(action => {

            action.middleware.forEach(key => _setMiddlewareForAction(router, action, key));

            router.route(action.url)[action.method](async(function (req, res, next) {

                req.controller = ctrl.name;
                req.action = action.key;

                let result = req.container.get(ctrl.name)[action.key](...arguments);

                Promise.resolve(result)
                    .then(async(value => {

                        if (!res.headersSent) {

                            if (typeof value !== 'undefined')
                                res.send(value);
                            else
                                res.sendStatus(200);
                        }

                        action.method !== 'get' && req.container.get("LoggerService").success(value);
                    }))
                    .catch(error => next(error));
            }));

        });

        ctrl.middleware.forEach(key => app.use(ctrl.baseUrl, _setMiddlewareForController(ctrl.baseUrl, key, router)));
        app.use(ctrl.baseUrl, router);

    })
}

function _setMiddlewareForAction(router, action, key) {
    router.route(action.url)[action.method](function (req, res, next) {

        Promise.resolve(req.container.get(key).handler(...arguments))
            .then(() => {

            })
            .catch(error => next(error));
    })
}

function _setMiddlewareForController(baseUrl, key, router) {
    router.use(baseUrl, function (req, res, next) {

        Promise.resolve(req.container.get(key).handler(...arguments))
            .then(() => {

            })
            .catch(error => next(error));
    })
}


