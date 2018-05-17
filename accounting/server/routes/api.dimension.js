"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    DimensionQuery = require('../queries/query.dimension');

router.route('/category/:categoryId')
    .get(async((req, res) => {
        let dimensionQuery = new DimensionQuery(req.branchId),
            result = await(dimensionQuery.getAll(req.params.categoryId, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send('dimensionCreate', [req.params.id, req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id')
    .get(async((req, res) => {
        let dimensionQuery = new DimensionQuery(req.branchId),
            result = await(dimensionQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send('dimensionUpdate', [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send('dimensionRemove', [req.params.id]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id/activate').put(async((req, res) => {
    try {
        req.container.get("CommandBus").send('activeDimension', [req.params.id]);
        res.json({isValid: true});
    }
    catch (e) {
        res.json({isValid: false, errors: e.errors});
    }
}));
router.route('/:id/deactivate').put(async((req, res) => {
    try {
        req.container.get("CommandBus").send('deActiveDimension', [req.params.id]);
        res.json({isValid: true});
    }
    catch (e) {
        res.json({isValid: false, errors: e.errors});
    }
}));

module.exports = router;