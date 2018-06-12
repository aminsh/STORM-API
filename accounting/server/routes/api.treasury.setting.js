"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    TreasurySettingRepository = require('../data/repository.treasury.setting'),
    TreasurySettingQuery = require('../queries/query.treasury.settings'),
    defaultTreasurySubsidiaryLedgerAccountTemplate = require('../config/settings/treasurySubsidiaryLedgerAccounts.json');

router.route('/')
    .get(async((req, res) => {
        let treasurySettingQuery = new TreasurySettingQuery(req.branchId),
            treasurySettingRepository = new TreasurySettingRepository(req.branchId),
            result = await(treasurySettingQuery.get());

        if (!result) {
            let entity = {
                journalGenerateAutomatic: false
            };
            await(treasurySettingRepository.create(entity));
            result = entity;
        }

        if (!result.subsidiaryLedgerAccounts)
            result.subsidiaryLedgerAccounts = defaultTreasurySubsidiaryLedgerAccountTemplate;
        else {
            const accountNotExits = defaultTreasurySubsidiaryLedgerAccountTemplate.asEnumerable()
                .where(item => !result.subsidiaryLedgerAccounts
                    .asEnumerable()
                    .any(p => p.key === item.key))
                .toArray();

            result.subsidiaryLedgerAccounts = result.subsidiaryLedgerAccounts.concat(accountNotExits);
        }

        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasurySettingUpdate", [req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;