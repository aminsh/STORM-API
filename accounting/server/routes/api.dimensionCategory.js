"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    DimensionCategoryQuery = require('../queries/query.dimensionCategory');

router.route('/')
    .get(async((req, res) => {
        let dimensionCategoryQuery = new DimensionCategoryQuery(req.branchId),
            result = await(dimensionCategoryQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send('dimensionCategoryCreate', [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id')
    .get(async((req, res) => {
        let dimensionCategoryQuery = new DimensionCategoryQuery(req.branchId),
            result = dimensionCategoryQuery.getById(req.params.id);
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send('dimensionCategoryUpdate', [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send('dimensionCategoryRemove', [req.params.id]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;

