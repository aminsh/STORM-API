"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductCategoryQuery = require('../queries/query.productCategory'),
    ProductCategoryRepository = require('../data/repository.productCategory');


router.route('/')
    .get(async((req, res) => {
        let productCategoryQuery = new ProductCategoryQuery(req.branchId),
            result = await(productCategoryQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        let productCategoryRepository = new ProductCategoryRepository(req.branchId),
            cmd = req.body,
            entity = {
                title: cmd.title,
            };

        await(productCategoryRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));


router.route('/:id')
    .get(async((req, res) => {
        let productCategoryQuery = new ProductCategoryQuery(req.branchId),
            result = await(productCategoryQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let productCategoryRepository = new ProductCategoryRepository(req.branchId),
            cmd = req.body,
            entity = {
                title: cmd.title,
            };

        entity = await(productCategoryRepository.update(req.params.id, entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));

module.exports = router;
