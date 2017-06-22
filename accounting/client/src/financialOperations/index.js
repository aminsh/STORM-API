"use strict";

import accModule from "../acc.module";
import TransferMoneyController from "./transferMoney.js";
import FinancialOperationsApi from './financialOperationsApi';

accModule
    .controller('transferMoneyController', TransferMoneyController)
    .service('financialOperationsApi', FinancialOperationsApi);