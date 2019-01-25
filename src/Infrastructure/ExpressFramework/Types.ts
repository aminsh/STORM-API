import * as express from "express";
import {interfaces} from "inversify";
import Container = interfaces.Container;
import Newable = interfaces.Newable;
import {User} from "../ApplicationCycle";

export interface Context {
    branchId?: string;
    fiscalPeriodId?: string;
    user?: User;
}

export interface Request extends express.Request {
    container: Container;
    controller: string;
    action: string;
    noLog: boolean;
    apiCaller: string;
    requestId: string;
    currentContext: Context
}

export interface Response extends express.Response {
}

export interface NextFunction extends express.NextFunction {
}

export type Constructor = {
    new(...args: any[])
}

export interface Controller {
    name: string;
    baseUrl: string;
    options?: ControllerOptions
    target: Constructor
}

export interface ControllerOptions {
    middleware: Newable<Middleware>[]
}

export interface Method {
    controllerName: string;
    method: string;
    url: string;
    key: string;
    options?: MethodOptions
}

export interface MethodOptions {
    middleware: Newable<Middleware>[]
}

export interface Parameter {
    controllerName: string;
    method: string;
    parameter: string;
    index: number;
    key?: string
}

export interface NoLog {
    controller: string;
    key: string;
}

export interface Middleware {
    handler(req: Request, res: Response, next: NextFunction): void | Promise<void>;
}