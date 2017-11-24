"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductCategoryQuery = require('../queries/query.productCategory');

router.route('/')
    .get(async((req, res) => {
        let productCategoryQuery = new ProductCategoryQuery(req.branchId),
            result = await(productCategoryQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService("productCategoryCreate", [req.body], req);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));


router.route('/:id')
    .get(async((req, res) => {
        let productCategoryQuery = new ProductCategoryQuery(req.branchId),
            result = await(productCategoryQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService("productCategoryUpdate", [req.params.req.body], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;
