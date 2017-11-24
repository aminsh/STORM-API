"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    DetailAccountQuery = require('../queries/query.detailAccount'),
    PersonQuery = require('../queries/query.person');

router.route('/:id/summary/sale/by-month').get(async((req, res) => {
    let personQuery = new PersonQuery(req.branchId),
        result = await(personQuery.getTotalPriceAndCountByMonth(req.params.id, req.fiscalPeriodId));
    res.json(result);
}));

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllPeople(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService('personCreate', [req.body], req);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id')
    .get(async((req, res) => {
        let personQuery = new PersonQuery(req.branchId),
            result = await(personQuery.getById(req.params.id, req.fiscalPeriodId));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService('personUpdate', [req.params.id, req.body], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService('detailAccountRemove', [req.params.id], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));


module.exports = router;