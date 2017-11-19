"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductService = ApplicationService.ProductService,
    Guid = instanceOf('utility').Guid,
    EventEmitter = instanceOf('EventEmitter'),
    ProductQuery = require('../queries/query.product');

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
        let cmd = req.body,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'productCreate'});

            const id = new ProductService(req.branchId).create(cmd);

            EventEmitter.emit('onServiceSucceed', serviceId, {id});

            res.json({isValid: true, returnValue: {id}});

        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }));

router.route('/batch')
    .post(async((req, res) => {

        let cmd = req.body,
            serviceId, ids;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: cmd, state: req, service: 'productCreateBatch'});

            ids = new ProductService(req.branchId).createBatch(cmd.products);

            EventEmitter.emit('onServiceSucceed', serviceId, {ids});

            res.json({isValid: true, returnValue: {ids}});

        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }

        if (!cmd.stockId) return;

        try {
            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {
                command: cmd,
                state: req,
                service: 'productAddToInputFirst'
            });

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

            const productService = new ProductService(req.branchId);

            firstInputList.forEach(item => productService.addToInventoryInputFirst(item.productId, req.fiscalPeriodId, item));

            EventEmitter.emit('onServiceSucceed', serviceId, {ids});
        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            console.log(e);
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
        let cmd = req.body,
            id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {
                command: {cmd, id},
                state: req,
                service: 'productUpdate'
            });

            new ProductService(req.branchId).update(id, cmd);

            EventEmitter.emit('onServiceSucceed', serviceId);

            res.json({isValid: true});

        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }))
    .delete(async((req, res) => {
        let id = req.params.id,
            serviceId;

        try {

            serviceId = Guid.new();

            EventEmitter.emit('onServiceStarted', serviceId, {command: {id}, state: req, service: 'productRemove'});

            new ProductService(req.branchId).remove(id);

            EventEmitter.emit('onServiceSucceed', serviceId);

            res.json({isValid: true});
        }
        catch (e) {
            EventEmitter.emit('onServiceFailed', serviceId, e);

            const errors = e instanceof ValidationException
                ? e.errors
                : ['internal errors'];

            res['_headerSent'] === false && res.json({isValid: false, errors});

            console.log(e);
        }
    }));

module.exports = router;
