"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductQuery = require('../queries/query.product'),
    ProductRepository = require('../data/repository.product'),
    InvoiceRepository = require('../data/repository.invoice');

router.route('/')
    .get(async((req, res) => {
        let productQuery = new ProductQuery(req.branchId),
            result = await(productQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        let productRepository = new ProductRepository(req.branchId),
            cmd = req.body,
            entity = {
                code: cmd.code,
                title: cmd.title,
                productType: cmd.productType,
                reorderPoint: cmd.reorderPoint,
                salePrice: cmd.salePrice,
                categoryId: cmd.categoryId
            };

        await(productRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));


router.route('/:id')
    .get(async((req, res) => {
        let productQuery = new ProductQuery(req.branchId),
            result = await(productQuery.getById(req.params.id, req.fiscalPeriodId));

        res.json(result);
    }))
    .put(async((req, res) => {
        let productRepository = new ProductRepository(req.branchId),
            cmd = req.body,
            entity = {
                code: cmd.code,
                title: cmd.title,
                reorderPoint: cmd.reorderPoint,
                salePrice: cmd.salePrice,
                categoryId: cmd.categoryId
            };

        entity = await(productRepository.update(req.params.id, entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }))
    .delete(async((req, res) => {
        let productRepository = new ProductRepository(req.branchId),
            invoiceRepository = new InvoiceRepository(req.branchId),
            errors = [],
            id = req.params.id;

        if (await(invoiceRepository.isExistsProduct(id)))
            errors.push('کالا / خدمات جاری در فاکتور استفاده شده . نمیتوانید آنرا حذف کنید');

        if (errors.length)
            return res.json({isValid: false, errors});

        await(productRepository.remove(id));

        res.json({isValid: true});
    }));

module.exports = router;
