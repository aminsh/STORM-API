"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    chartOfAccount = require('./setup.chartOfAccounts'),
    fiscalPeriod = require('./setup.fiscalPeriod'),
    firstFund = require('./setup.firstFund'),
    firstStock = require('./setup.firstStock'),
    EventEmitter = require('../../services/shared').service.EventEmitter;

EventEmitter.on('on-branch-created', async(function (branchId) {
    chartOfAccount(branchId);
    fiscalPeriod(branchId);
    firstFund(branchId);
    firstStock(branchId);
}));