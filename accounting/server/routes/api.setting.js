"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    SettingRepository = require('../data/repository.setting'),
    SettingQuery = require('../queries/query.settings');

router.route('/')
    .get(async((req, res) => {
        let settingQuery = new SettingQuery(req.branchId),
            settingRepository = new SettingRepository(req.branchId),
            result = await(settingQuery.get());

        if(!result){
            let entity = {vat: 9};
            await(settingRepository.create(entity));
            result = entity;
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
    .put(async((req, res)=> {
        let settingRepository = new SettingRepository(req.branchId),
            cmd = req.body,

            entity = {
                vat: cmd.vat,
                bankId: cmd.bankId,
                canControlInventory: cmd.canControlInventory
            };

        await(settingRepository.update(entity));

        res.json({isValid: true});
    }));

module.exports = router;