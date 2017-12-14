"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    DetailAccountQuery = require('../queries/query.detailAccount');

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllFunds(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService('fundCreate', [req.body], req);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService('fundUpdate', [req.params.id, req.body], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService('fundRemove', [req.params.id], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id/tiny-turnover').get(async((req, res) => {
    let detailAccountQuery = new DetailAccountQuery(req.branchId),
        result = await(detailAccountQuery.getAllTurnoversWithRemainder(
            req.params.id,
            'fund',
            req.fiscalPeriodId,
            req.query));

    res.json({data: result});
}));


module.exports = router;