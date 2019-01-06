import {parameters} from "./metadata";
import * as Enumerable from "linq";
import * as express from "express";
import {Parameter} from "./Types";

class ParameterDecoratorHandler {

    getParameters(
        controller: string,
        method: string,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction): any[] {

        return Enumerable.from(parameters)
            .where(item => item.controllerName === controller && item.method === method)
            .orderBy(item => item.index)
            .select(item => this[item.parameter](item, req, res, next))
            .toArray();
    }

    private request(param: Parameter, req: express.Request) {
        return req;
    }

    private respones(param: Parameter, req: express.Request, res: express.Response) {
        return res;
    }

    private body(param: Parameter, req: express.Request) {
        return req.body;
    }

    private parameter(param: Parameter, req: express.Request) {

        if (param.key)
            return req.params[param.key];

        return req.params;
    }

    private query(param: Parameter, req: express.Request) {

        if (param.key)
            return req.query[param.key];

        return req.query;
    }
}

export const parameterDecoratorHandler = new ParameterDecoratorHandler();