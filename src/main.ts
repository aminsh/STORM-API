import "reflect-metadata";
import "./Infrastructure/Global";
import {Database} from "./Database";
import {Request, Response, NextFunction} from "./Infrastructure/ExpressFramework/Types";
import * as ExpressFramework from "./Infrastructure/ExpressFramework";
import * as DependencyInjection from "./Infrastructure/DependencyInjection";
import {BadRequestException, ForbiddenException} from "./Infrastructure/Exceptions";
import * as cls from 'cls-hooked';
import {RequestContextImpl} from "./Infrastructure/ApplicationCycle";

import "./Config";
import "./Product";
import "./Branch";
import "./Accounting";
import "./FiscalPeriod";
import * as express from "express";
import { Guid } from "./Infrastructure/Utility";

async function bootstrap() {

    await Database.register();

    ExpressFramework.register(
        (app: express.Application) => {
            app.disable('x-powered-by');
        },
        (req: Request, res: Response, next: NextFunction) => {
            req.container = DependencyInjection.container.createChild();

            req.apiCaller = req.headers['api-caller'] as string || 'External api';

            req.requestId = Guid.create();

            req.container.bind('HttpContext').toConstantValue({request: req});

            const sessionName = 'STORM-SESSION';
            const session = cls.getNamespace(sessionName) || cls.createNamespace(sessionName);

            req.currentContext = {};

            session.run(async () => {
                session.set('CURRENT-CONTEXT', new RequestContextImpl(req));
                next();
            });
        },
        (err: any ,req: Request, res: Response, next: NextFunction) => {
           if(err instanceof ForbiddenException)
               res.status(403).send(err.message);

           if(err instanceof BadRequestException)
               res.status(400).send(err.message);
        }
    );
}

bootstrap().then(() => console.log('app is started'));