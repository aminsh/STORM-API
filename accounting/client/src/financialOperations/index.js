"use strict";

import accModule from "../acc.module";
import TransferMoneyController from "./transferMoney.js";
import FinancialOperationsApi from './financialOperationsApi';
import CreateIncomeController from './createIncome';

accModule
    .controller('transferMoneyController', TransferMoneyController)
    .controller('createIncomeController', CreateIncomeController)
    .service('financialOperationsApi', FinancialOperationsApi)