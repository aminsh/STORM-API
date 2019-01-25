import {decorate, injectable} from "inversify";
import {controllers, methods, noLogs, parameters} from "./metadata";
import {Constructor, ControllerOptions, MethodOptions} from "./Types";

export function Controller(url: string, options?: ControllerOptions): Function {

    return function (target: Constructor) {
        controllers.push({name: target.name, baseUrl: url, options, target});

        //decorate(injectable(), target);
    }
}

export function Get(url: string = '/', options?: MethodOptions): Function {

    return function (target: any, key: string) {
        methods.push({
            controllerName: target.constructor.name,
            method: 'get',
            url,
            key,
            options
        });
    }
}

export function Post(url: string = '/', options?: MethodOptions): Function {
    return function (target: any, key: string) {
        methods.push({
            controllerName: target.constructor.name,
            method: 'post',
            url,
            key,
            options
        });
    }
}

export function Put(url?: string, options?: MethodOptions): Function {
    return function (target: any, key: string) {
        methods.push({
            controllerName: target.constructor.name,
            method: 'put',
            url,
            key,
            options
        });
    }
}

export function Delete(url?: string, options?: MethodOptions): Function {
    return function (target: any, key: string) {
        methods.push({
            controllerName: target.constructor.name,
            method: 'delete',
            url,
            key,
            options
        });
    }
}

export function NoLog() {
    return function (target, key) {
        noLogs.push({controller: target.constructor.name, key});
    }
}

export function Request(): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'request',
            index
        });
    }
}

export function Response(): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'response',
            index
        });
    }
}

export function Body(key?: string): Function {
    return function (target: any, method: string, index: number) {
        parameters.push({
            controllerName: target.constructor.name,
            method,
            parameter: 'body',
            index,
            key
        });
    }
}

export function Parameters(key?: string): Function {
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

export function Query(key?: string): Function {
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