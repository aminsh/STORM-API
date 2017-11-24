"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod');

router.route('/')
    .get(async((req, res) => {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.branchId),
            result = await(fiscalPeriodQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {

        try {
            const id = RunService("fiscalPeriodCreate", [req.body], req);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));


module.exports = router;
