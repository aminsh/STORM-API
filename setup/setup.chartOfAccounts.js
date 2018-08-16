"use strict";

const
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = Utility.Guid,
    Common = instanceOf('utility').Common,
    knex = instanceOf('knex');


let defaultAccountCategories = require('../application/src/BranchSetup/json/accountCategories.json').groups,
    defaultGeneralLedgerAccounts = require('../application/src/BranchSetup/json/generalLedgerAccounts.json'),
    defaultSubsidiaryLedgerAccounts = require('../application/src/BranchSetup/json/subsidiatyLedgerAccounts.json');


module.exports = async.result(function (branchId) {

    defaultAccountCategories.forEach(item => item.branchId = branchId);
    defaultGeneralLedgerAccounts.forEach(item => {
        item.branchId = branchId;
        item.id = Guid.new();
    });

    let subsidiaryLedgerAccounts = defaultSubsidiaryLedgerAccounts.asEnumerable().join(
        defaultGeneralLedgerAccounts,
        sla => sla.parentCode,
        gla => gla.code,
        (sla, gla) => ({
            id: Guid.new(),
            branchId,
            generalLedgerAccountId: gla.id,
            code: sla.code,
            title: sla.title,
            key: sla.key,
            balanceType: sla.balanceType,
            hasDetailAccount: sla.hasDetailAccount
        }))
        .toArray();


    defaultAccountCategories.forEach(item => delete item.category);
    subsidiaryLedgerAccounts.forEach(item => delete item.key);

    await(knex('subsidiaryLedgerAccounts').where('branchId', branchId).del());
    await(knex('generalLedgerAccounts').where('branchId', branchId).del());
    await(knex('accountCategories').where('branchId', branchId).del());

    await(knex('accountCategories').insert(defaultAccountCategories));
    await(knex('generalLedgerAccounts').insert(defaultGeneralLedgerAccounts));

    await(Common.waitFor(1000));

    await(knex('subsidiaryLedgerAccounts').insert(subsidiaryLedgerAccounts));

});

