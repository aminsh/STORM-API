"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductQuery = require('../queries/query.product');

router.route('/:id/summary/sale/by-month')
    .get(async((req, res) => {
        let productQuery = new ProductQuery(req.branchId, req.user.id),
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
        try {

            const id = req.container.get("CommandBus").send("productCreate", [req.body]);

            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/batch')
    .post(async((req, res) => {

        let cmd = req.body,
            ids;

        try {

            ids = req.container.get("CommandBus").send("productCreateBatch", [cmd.products]);

            res.json({isValid: true, returnValue: {ids}});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

        if (!cmd.stockId) return;

        let firstInputList = new ProductQuery(req.branchId).getManyByIds(ids).asEnumerable()
            .join(
                cmd.products.asEnumerable().where(item => item.quantity && item.quantity > 0).toArray(),
                first => first.title,
                second => second.title,
                (first, second) => ({
                    productId: first.id,
                    stockId: cmd.stockId,
                    quantity: second.quantity,
                    unitPrice: second.unitPrice
                }))
            .toArray();

        req.container.get("CommandBus").send("productAddToInventoryInputFirst", [firstInputList, cmd.stockId]);

    }));

router.route('/:id/add-to-input-first')
    .post(async((req, res) => {
        try {
            let items = req.body.asEnumerable()
                .select(item => ({
                    stockId: item.stockId,
                    items: [{productId: req.params.id, quantity: item.quantity, unitPrice: item.unitPrice}]
                }))
                .toArray();


            items.forEach(item => req.container.get("CommandBus").send("productAddToInventoryInputFirst", [item.items, item.stockId]));

            res.json({isValid: true});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

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
        try {
            req.container.get("CommandBus").send("productUpdate", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("productRemove", [req.params.id]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;
