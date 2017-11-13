"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductQuery = require('../queries/query.product'),
    ProductRepository = require('../data/repository.product'),
    InvoiceRepository = require('../data/repository.invoice'),
    InventoryDomain = require('../domain/inventory'),
    String = instanceOf('utility').String;

router.route('/:id/summary/sale/by-month').get(async((req, res) => {
    let productQuery = new ProductQuery(req.branchId),
        result = await(productQuery.getTotalPriceAndCountByMonth(req.params.id, req.fiscalPeriodId));

    res.json(result);
}));

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
                categoryId: cmd.categoryId,
                scaleId: cmd.scaleId,
                referenceId: cmd.referenceId,
                barcode: cmd.barcode
            };

        await(productRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));

router.route('/batch')
    .post(async((req, res) => {
        let productRepository = new ProductRepository(req.branchId),
            inventoryDomain = new InventoryDomain(req.branchId, req.fiscalPeriodId),
            cmd = req.body,
            isValidForInput = item => {
                if(!(item.quantity && item.quantity !== 0))
                    return false;
                if(!(item.unitPrice && item.unitPrice !== 0))
                    return false;

                return true;
            };

        cmd.products.forEach(item => {
            if (String.isNullOrEmpty(item.title)) {
                item.hasError = true;
                item.errorMessage = 'عنوان مقدار ندارد'
            }
        });

        let entities = cmd.products.asEnumerable()
            .where(item => !item.hasError)
            .select(item => ({
                code: item.code,
                title: item.title,
                productType: item.productType || 'good',
                reorderPoint: item.reorderPoint,
                salePrice: item.salePrice,
                categoryId: item.categoryId,
                scaleId: item.scaleId,
                referenceId: item.referenceId,
                barcode: item.barcode
            }))
            .toArray();


        await(productRepository.create(entities));

        res.json({
            isValid: true,
        });

        if(!cmd.stockId) return;

        let firstInputList = entities.asEnumerable()
            .join(
                cmd.products.asEnumerable().where(isValidForInput).toArray(),
                first => first.title,
                second => second.title,
                (first, second) => ({
                    productId: first.id,
                    data: [{
                        stockId: cmd.stockId,
                        quantity: second.quantity,
                        unitPrice: second.unitPrice
                    }]
                }))
            .toArray();

        firstInputList.forEach(async.result(item => await(inventoryDomain.addProductToInputFirst(item))))
    }))

router.route('/goods')
    .get(async((req, res) => {
        let productQuery = new ProductQuery(req.branchId),
            result = await(productQuery.getAllGoods(req.query));

        res.json(result);
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
                productType: cmd.productType,
                salePrice: cmd.salePrice,
                categoryId: cmd.categoryId,
                scaleId: cmd.scaleId,
                referenceId: cmd.referenceId,
                barcode: cmd.barcode
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
