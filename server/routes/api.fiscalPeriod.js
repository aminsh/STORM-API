"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    FiscalPeriodRepository = require('../data/repository.fiscalPeriod'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod');

router.route('/')
    .get(async((req, res) => {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.knex),
            result = await(fiscalPeriodQuery.getAll(req.query));
        res.json(result);
    }));

module.exports = router;
