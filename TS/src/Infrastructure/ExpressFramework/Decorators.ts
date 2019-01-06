import {decorate, injectable} from "inversify";
import {controllers, methods, noLogs, parameters} from "./metadata";
import {Constructor} from "./Types";

export function Controller(url: string, ...middleware: string[]): Function {

    return function (target: Constructor) {
        controllers.push({name: target.name, baseUrl: url, middleware, target});

        decorate(injectable(), target);
    }
}

export function Get(url: string, ...middleware: string[]): Function {

    return function (target: any, key: string) {
        methods.push({
            controllerName: target.constructor.name,
            method: 'get',
            url,
            key,
            middleware
        });
    }
}

export function Post(url: string, ...middleware: string[]): Function {
    return function (target: any, key: string) {
        methods.push({
            controllerName: target.constructor.name,
            method: 'post',
            url,
            key,
            middleware
        });
    }
}

export function Put(url: string, ...middleware: string[]): Function {
    return function (target: any, key: string) {
        methods.push({
            controllerName: target.constructor.name,
            method: 'put',
            url,
            key,
            middleware
        });
    }
}

export function Delete(url: string, ...middleware: string[]): Function {
    return function (target: any, key: string) {
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

export function request(): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'request',
            index
        });
    }
}

export function response(): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'response',
            index
        });
    }
}

export function body(): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'body',
            index
        });
    }
}

export function parameter(key?: string): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'parameter',
            index,
            key
        });
    }
}

export function query(key?: string): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'query',
            index,
            key
        });
    }
}