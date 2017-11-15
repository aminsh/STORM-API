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

        if(!result.subsidiaryLedgerAccounts)
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
        let settingRepository = new SettingRepository(req.branchId),
            entity = {
                vat: 9,
            };

        await(settingRepository.create(entity));

        res.json({isValid: true});

    }))
    .put(async((req, res) => {
        let settingRepository = new SettingRepository(req.branchId),
            cmd = req.body;

        cmd.canCreateSaleOnNoEnoughInventory = cmd.canControlInventory
            ? cmd.canCreateSaleOnNoEnoughInventory
            : false;

        cmd.stockId = cmd.productOutputCreationMethod === 'defaultStock'
            ? cmd.stockId
            : null;

        let entity = {
            vat: cmd.vat,
            bankId: cmd.bankId,
            canControlInventory: cmd.canControlInventory,
            canCreateSaleOnNoEnoughInventory: cmd.canCreateSaleOnNoEnoughInventory,
            productOutputCreationMethod: cmd.productOutputCreationMethod,
            canSaleGenerateAutomaticJournal: cmd.canSaleGenerateAutomaticJournal,
            stakeholders: JSON.stringify(cmd.stakeholders),
            subsidiaryLedgerAccounts: JSON.stringify(cmd.subsidiaryLedgerAccounts),
            stockId: cmd.stockId,
            saleCosts: JSON.stringify(cmd.saleCosts),
            webhooks: JSON.stringify(cmd.webhooks),
            invoiceDescription: cmd.invoiceDescription
        };

        await(settingRepository.update(entity));

        res.json({isValid: true});
    }));

module.exports = router;