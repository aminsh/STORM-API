"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    StockRepository = require('../data/repository.stock'),
    StockQuery = require('../queries/query.stock');

router.route('/')
    .get(async((req, res) => {
        let stockQuery = new StockQuery(req.branchId),
            result = await(stockQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService("stockCreate", [req.body], req);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id')
    .get(async((req, res) => {
        let stockQuery = new StockQuery(req.branchId),
            result = await(stockQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService("stockUpdate", [req.params.id, req.body], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService("stockRemove", [req.params.id], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;