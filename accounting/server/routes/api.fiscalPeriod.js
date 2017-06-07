"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    translate = require('../services/translateService'),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod');

router.route('/')
    .get(async((req, res) => {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']),
            result = await(fiscalPeriodQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let fiscalPeriodRepository = new FiscalPeriodRepository(req.cookies['branch-id']),
            cmd = req.body,
            errors = [],
            entity = {
                title: cmd.title,
                minDate: cmd.minDate,
                maxDate: cmd.maxDate,
                isClosed: false
            };

        if (entity.minDate > entity.maxDate) {
            errors.push(translate('From date can not be greater than to date'));
            return res.json({
                errors,
                isValid: false
            });
        }

        await(fiscalPeriodRepository.create(entity));

        res.cookie('current-period', entity.id);

        res.json({
            isValid: true
        });

    }));


module.exports = router;
