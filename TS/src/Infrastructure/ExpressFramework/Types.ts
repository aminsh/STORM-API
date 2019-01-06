import * as express from "express";
import {interfaces} from "inversify";
import Container = interfaces.Container;

export interface Request extends express.Request {
    container: Container;
    controller: string;
    action: string;
    noLog: boolean
}

export type Constructor = {
    new(...args: any[])
}

export interface Controller {
    name: string;
    baseUrl: string;
    middleware: string[];
    target: Constructor
}

export interface Method {
    controllerName: string;
    method: string;
    url: string;
    key: string;
    middleware: string[]
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
    handler(...args);
}