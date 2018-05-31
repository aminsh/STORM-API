"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    SettingRepository = require('../data/repository.setting'),
    SettingQuery = require('../queries/query.settings'),
    defaultSubsidiaryLedgerAccountTemplate = require('../config/settings/subsidiaryLedgerAccounts.json');

router.route('/')
    .get(async((req, res) => {
        let settingQuery = new SettingQuery(req.branchId),
            settingRepository = new SettingRepository(req.branchId),
            result = await(settingQuery.get());

        if (!result) {
            let entity = {vat: 9};
            await(settingRepository.create(entity));
            result = entity;
        }

        if (!result.subsidiaryLedgerAccounts)
            result.subsidiaryLedgerAccounts = defaultSubsidiaryLedgerAccountTemplate;
        else {
            const accountNotExits = defaultSubsidiaryLedgerAccountTemplate.asEnumerable()
                .where(item => !result.subsidiaryLedgerAccounts
                    .asEnumerable()
                    .any(p => p.key === item.key))
                .toArray();

            result.subsidiaryLedgerAccounts = result.subsidiaryLedgerAccounts.concat(accountNotExits);
        }

        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            req.container.get("CommandBus").send("createSettings", [req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("updateSettings", [req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;