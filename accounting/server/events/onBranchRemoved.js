"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    knex = require('../services/knex');

EventEmitter.on('on-branch-removed', async(branchId => {

    const tablesHasBranchId = [
        'detailAccounts',
        'dimensions',
        'fiscalPeriods',
        'subsidiaryLedgerAccounts',
        'generalLedgerAccounts',
        'payments',
        'journals',
        'tags',
        'invoices',
        'inventories',
        'products',
        'productCategories',
        'stocks',
        'scales',
        'settings',
    ];

    tablesHasBranchId.forEach(async.result(table =>
        await(knex(table).where('branchId', branchId).del()))
    );

}));
