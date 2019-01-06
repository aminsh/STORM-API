import * as express from "express";
import {interfaces} from "inversify";
import Container = interfaces.Container;
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as compression from "compression";
import {registerController} from "./registerController";
import {controllers} from "./metadata";

export {Controller, Get, Post, Put, Delete, NoLog, request, body, query, parameter, response} from "./Decorators";
export {Request} from "./Types";

export function register(container: Container,
                         /*config: (app: express.Application) => {},
                         setFirstMiddleware: (req: any, res: express.Response, next: express.NextFunction) => void,
                         setErrorMiddleware?: (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => void,*/
                         app: express.Application) {

    /*TODO TS config disabled
    app.use(compression());
    app.use(cors());
    app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(cookieParser());

    if (typeof config === 'function')
        config(app);

    if (typeof setFirstMiddleware === 'function')
        app.use(setFirstMiddleware);*/

    controllers.forEach(ctrl => {
        const router = registerController(ctrl, container);
        app.use(ctrl.baseUrl, router);
    });

    /* TODO TS config disabled
    if (typeof setErrorMiddleware === 'function')
        app.use(setErrorMiddleware);

    const port = process.env["PORT"];

    app.listen(port, () => console.log(`Port ${port} is listening ...`));*/
}