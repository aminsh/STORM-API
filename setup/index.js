"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    chartOfAccount = require('./setup.chartOfAccounts'),
    fiscalPeriod = require('./setup.fiscalPeriod'),
    firstFund = require('./setup.firstFund'),
    firstStock = require('./setup.firstStock'),
    EventEmitter = instanceOf('EventEmitter'),
    knex = instanceOf('knex'),

    /**@type {TokenGenerator}*/
    TokenGenerator = instanceOf('TokenGenerator');

EventEmitter.on('on-branch-created', async(function (branchId) {

    await(knex('settings').insert({
        id: Utility.Guid.new(),
        subsidiaryLedgerAccounts: JSON.stringify([]),
        branchId
    }));

    await(knex('treasurySettings').insert({
        id: Utility.Guid.new(),
        subsidiaryLedgerAccounts: JSON.stringify([]),
        branchId
    }));

    chartOfAccount(branchId);
    fiscalPeriod(branchId);
    firstFund(branchId);
    firstStock(branchId);
}));