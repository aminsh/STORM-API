"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    chartOfAccount = require('./setup.chartOfAccounts'),
    fiscalPeriod = require('./setup.fiscalPeriod'),
    firstFund = require('./setup.firstFund'),
    firstStock = require('./setup.firstStock'),
    EventEmitter = instanceOf('EventEmitter'),

    /**@type {BranchRepository}*/
    branchRepository = instanceOf('branch.repository'),
    makeOrder = require('./setup.makeOrder');

EventEmitter.on('on-branch-created', async(function (branchId) {

    let branch = await(branchRepository.getById(branchId));
    await(branchRepository.addMember(branchId, branch.ownerId));

    chartOfAccount(branchId);
    fiscalPeriod(branchId);
    firstFund(branchId);
    firstStock(branchId);
}));