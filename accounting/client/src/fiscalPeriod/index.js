"use strict";

import accModule from "../acc.module";
import FiscalPeriodController from "./fiscalPeriods.controller";
import CreateFiscalPeriodController from "./createFiscalPeriod.controller";

accModule
    .controller('fiscalPeriodController', FiscalPeriodController)
    .controller('createFiscalPeriodController', CreateFiscalPeriodController);