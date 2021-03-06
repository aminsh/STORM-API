import "reflect-metadata";

import "./Infrastructure/Utilities/string.prototypes";
import "./Infrastructure/Utilities/array.prototypes";
import "./Infrastructure/Utilities/function.prototypes";
import "./Infrastructure/Globals";

import express from "express";
import async from "asyncawait/async";
import container from "./Infrastructure/DependencyInjection";

import * as Database from "./Database";
import * as Config from "./Config";
import * as Notification from "./Notification";
import * as StormOrder from "./StormOrder";
import * as Branch from "./Branch";
import * as User from "./User";
import * as Logger from "./Logger";
import * as Constants from "./Constants";
import * as ThirdParty from "./ThirdParty";
import * as Settings from "./Settings";
import * as Product from "./Product";
import * as Person from "./Person";
import * as FiscalPeriod from "./FiscalPeriod";
import * as Bookkeeping from "./Bookkeeping";
import * as Invoice from "./Invoice";
import * as Sale from "./Sale";
import * as Purchase from "./Purchase";
import * as Inventory from "./Inventory";
import * as BankAndFund from "./BankAndFund";
import * as Treasury from "./Treasury";
import * as Verification from "./Verification";
import * as Integration from "./Integration";
import * as BranchSetup from "./BranchSetup";
import * as Report from "./Report";
import * as Permission from "./Permission";
import * as Currency from "./Currency";
//import * as InventoryAccounting from "./InventoryAccounting";
import * as JournalGeneration from "./JournalGeneration";
import * as Site from "./Site";

Database.register(container);
Config.register(container);
Notification.register(container);
StormOrder.register(container);
Branch.register(container);
User.register(container);
Logger.register(container);
Constants.register(container);
ThirdParty.register(container);
Settings.register(container);
Product.register(container);
Person.register(container);
FiscalPeriod.register(container);
Bookkeeping.register(container);
Invoice.register(container);
Sale.register(container);
Purchase.register(container);
Inventory.register(container);
BankAndFund.register(container);
Treasury.register(container);
Verification.register(container);
Integration.register(container);
BranchSetup.register(container);
Report.register(container);
Permission.register(container);
//InventoryAccounting.register(container);
JournalGeneration.register(container);
Site.register(container);
Currency.register(container);

import { Context } from "./Context";
import { register } from "./Infrastructure/expressUtlis";

container.bind("State").to(Context);

function config(app) {

    app.use('/swagger', express.static(__dirname + '/../swagger'));
}

function setFirstMiddleware(req, res, next) {

    req.container = container.createChild();

    req.apiCaller = req.headers[ 'api-caller' ] || 'External api';

    req.requestId = Utility.TokenGenerator.generate128Bit();

    req.container.bind('HttpContext').toConstantValue({ request: req });

    next();
}

const setErrorMiddleware = async(function (err, req, res, next) {

    if (err instanceof ValidationException)
        return invalidHandler(err.errors);

    if (err instanceof ValidationSingleException)
        return invalidHandler(err.message);

    if (err instanceof NotFoundException)
        return res.sendStatus(404);

    if (err instanceof ForbiddenException)
        return res.status(403).send(err.message);

    res.sendStatus(500);

    req.container.get("LoggerService").error(err);

    function invalidHandler(error) {

        res.status(400).send(error);

        if (req.noLog) return;

        req.container.get("LoggerService").invalid(error);
    }
});

register(container, config, setFirstMiddleware, setErrorMiddleware);






