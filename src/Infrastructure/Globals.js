import toResult from "asyncawait/await";
import Promise from "promise";
import events from "events";

import kendoQueryResolve from "./Utilities/kendoQueryResolve";
import * as string from "./Utilities/string";
import PersianDate from "./Utilities/persianDate";
import Guid from "./Utilities/guidService";
import TokenGenerator from "./Utilities/token.generator";
import * as exceptions from "./Utilities/exceptions";

function assign(obj, assignTo) {
    Object.keys(obj).forEach(key => assignTo[key] = obj[key]);
}

const Utility = {
    String: string,
    isUndefined: obj => typeof obj === 'undefined',
    PersianDate,
    Guid,
    delay: milliseconds => toResult(new Promise(resolve => setTimeout(() => resolve(), milliseconds))),
    TokenGenerator: new TokenGenerator,
    kendoQueryResolve
};

assign(exceptions, global);

global.Utility = Utility;
global.EventEmitter = new events.EventEmitter();