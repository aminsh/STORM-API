"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    GeneralLedgerAccountRepository = require('../../../../accounting/server/data/repository.generalLedgerAccount'),
    SubsidiaryLedgerAccountRepository = require('../../../../accounting/server/data/repository.subsidiaryLedgerAccount'),
    defaultGeneralLedgerAccounts = require('../../../../accounting/server/config/generalLedgerAccounts.json').RECORDS,
    defaultSubsidiaryLedgerAccounts = require('../../../../accounting/server/config/subsidiaryLedgerAccounts.json').RECORDS,
    enums = require('../../../../accounting/shared/enums'),
    groups = getChartOfAccount();



module.exports = async.result(function (branchId) {
    let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(branchId),
        subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(branchId);

    groups.forEach(g => {
        g.generalLedgerAccounts.forEach(async.result(gla => {
            let newGla = {
                title: gla.title,
                code: gla.code,
                groupingType: g.key,
                balanceType: gla.balanceType,
                postingType: gla.postingType,
                isLocked: gla.isLocked
            };

            await(generalLedgerAccountRepository.create(newGla));

            gla.subsidiaryLedgerAccounts.forEach(async.result(sla => {
                let entity = {
                    title: sla.title,
                    code: sla.code,
                    generalLedgerAccountId: newGla.id,
                    isLocked: sla.isLocked,
                    branchId
                };

                await(subsidiaryLedgerAccountRepository.create(entity));
            }));
        }));
    });

});

function getChartOfAccount() {
    defaultGeneralLedgerAccounts.forEach(gla => {
        let subs = defaultSubsidiaryLedgerAccounts
            .asEnumerable()
            .where(sla => sla.generalLedgerAccountId == parseInt(gla.code))
            .toArray();
        gla.subsidiaryLedgerAccounts = subs;
    });

    let groups = enums.AccountGroupingType().data;

    groups.forEach(g => {
        let generals = defaultGeneralLedgerAccounts
            .asEnumerable()
            .where(gla => gla.groupLedgerAccountId == parseInt(g.key))
            .toArray();
        g.generalLedgerAccounts = generals;
    });

    return groups;
}