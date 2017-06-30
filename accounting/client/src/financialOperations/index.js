"use strict";

import accModule from "../acc.module";
import TransferMoneyController from "./transferMoney.js";
import FinancialOperationsApi from './financialOperationsApi';
import CreateIncomeController from './createIncome';
import CreateExpenseController from './createExpense';

accModule
    .controller('transferMoneyController', TransferMoneyController)
    .controller('createIncomeController', CreateIncomeController)
    .controller('createExpenseController',CreateExpenseController)
    .service('financialOperationsApi', FinancialOperationsApi)