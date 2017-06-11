"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductQuery = require('../queries/query.product'),
    ProductRepository = require('../data/repository.product');


router.route('/')
    .get(async((req, res) => {
        let productQuery = new ProductQuery(req.cookies['branch-id']),
            result = await(productQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        let productRepository = new ProductRepository(req.cookies['branch-id']),
            cmd = req.body,
            entity = {
                code: cmd.code,
                title: cmd.title,
                productType: cmd.productType,
                reorderPoint: cmd.reorderPoint,
                salePrice: cmd.salePrice
            };

        await(productRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));


router.route('/:id')
    .get(async((req, res) => {
        let productQuery = new ProductQuery(req.cookies['branch-id']),
            result = await(productQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let productRepository = new ProductRepository(req.cookies['branch-id']),
            cmd = req.body,
            entity = {
                code: cmd.code,
                title: cmd.title,
                productType: cmd.productType,
                reorderPoint: cmd.reorderPoint,
                salePrice: cmd.salePrice
            };

        entity = await(productRepository.update(req.params.id, entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));

module.exports = router;
