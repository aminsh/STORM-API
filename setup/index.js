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

    let branch = await(knex.select('*').from('branches').where({id: branchId}).first()),

        member = {
        branchId,
        userId: branch.ownerId,
        app: 'accounting',
        state: 'active',
        isOwner: true,
        token: TokenGenerator.generate256Bit()
    };

    await(knex('userInBranches').insert(member));

    await(knex('settings').insert({
        id: Utility.Guid.new(),
        subsidiaryLedgerAccounts: JSON.stringify([])
    }));

    chartOfAccount(branchId);
    fiscalPeriod(branchId);
    firstFund(branchId);
    firstStock(branchId);
}));