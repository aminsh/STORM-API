import "reflect-metadata";
import {register as registerExpressFramework} from "./Infrastructure/ExpressFramework/index";
import {createConnection} from "typeorm";
import {interfaces} from "inversify";
import * as express from "express";
import {dependencies, resolveLifecycle} from "./Infrastructure/DependencyInjection";

import * as AccountingModule from "./Accounting";
import * as BankAndFundModule from "./BankAndFund";

//const container = new Container({defaultScope: "Request"});

async function registerConnection(): Promise<void> {

    await createConnection({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: [
            ...AccountingModule.entities,
            ...BankAndFundModule.entities
        ],
        logging: "all",
        synchronize: false
    });
}

/* TODO disabled for TS
register(
    container,
    null,
    (req: Request, res: express.Response, next: express.NextFunction):void => {
        req.container = container.createChild();
        next();
    }
);*/

export async function register(container: interfaces.Container, app: express.Application) {

    dependencies.forEach(dep => {
        const bidingContext: any = container.bind(dep.name).to(dep.target);

        if (dep.lifecycle)
            resolveLifecycle(bidingContext, dep.lifecycle);
    });

    registerExpressFramework(container, app);

    await registerConnection();
}



