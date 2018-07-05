import {FiscalPeriodQuery} from "./FiscalPeriodQuery";
import {FiscalPeriodService} from "./FiscalPeriodService";
import {FiscalPeriodRepository} from "./FiscalPeriodRepository";
import {FiscalPeriodMiddlewareSelector} from "./FiscalPeriodMiddlewareSelector";

import "./FiscalPeriodController";

export function register(container) {

    container.bind("FiscalPeriodQuery").to(FiscalPeriodQuery);
    container.bind("FiscalPeriodService").to(FiscalPeriodService);
    container.bind("FiscalPeriodRepository").to(FiscalPeriodRepository);
    container.bind("FiscalPeriodMiddlewareSelector").to(FiscalPeriodMiddlewareSelector);
}