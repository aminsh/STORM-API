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
            const id = req.container.get("CommandBus").send("stockCreate", [req.body]);
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
            req.container.get("CommandBus").send("stockUpdate", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("stockRemove", [req.params.id]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;