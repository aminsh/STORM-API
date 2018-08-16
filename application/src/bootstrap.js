import "reflect-metadata";
//import {Container} from "inversify";
import async from "asyncawait/async";
import {container} from "./di.config";

//const container = new Container({defaultScope: "Request"});

import * as Database from "./Database";
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
import * as Verification from "./Verification";
import * as Integration from "./Integration";
import * as BranchSetup from "./BranchSetup";

Database.register(container);
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
Verification.register(container);
Integration.register(container);
BranchSetup.register(container);

import {Context} from "./Context";
import {register} from "./core/expressUtlis";

container.bind("State").to(Context);
container.bind("Context").to(Context);

function setConfig(req, res, next) {

    req.container = container.createChild();

    req.apiCaller = req.headers['api-caller'] || 'External api';

    req.requestId = Utility.TokenGenerator.generate128Bit();

    req.container.bind('HttpContext').toConstantValue({request: req});

    next();
}

const setErrorConfig = async(function (err, req, res, next) {

    if (err instanceof ValidationException)
        return invalidHandler(err.errors);

    if (err instanceof ValidationSingleException)
        return invalidHandler(err.message);

    if (err instanceof NotFoundException)
        return res.sendStatus(404);

    res.sendStatus(500);

    req.container.get("LoggerService").error(err);

    function invalidHandler(error) {

        res.status(400).send(error);

        if (req.noLog) return;

        req.container.get("LoggerService").invalid(error);
    }
});

register(container, setConfig, setErrorConfig);






