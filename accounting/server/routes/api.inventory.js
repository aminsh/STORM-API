"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    InventoryQuery = require('../queries/query.inventory');

router.route('/inputs')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getAll(req.fiscalPeriodId, 'input', req.query));

        return res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("inventoryInputCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/products')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getAllInventoryProducts(req.query));
        return res.json(result);
    }));

router.route('/inputs/:id')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("inventoryInputUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("inventoryInputRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/inputs/:id/set-price')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("inventoryInputSetPrice", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/inputs/:id/fix-quantity')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("inventoryInputFixQuantity", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/inputs/max-number')
    .get(async((req, res) => {
        const inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getMaxNumber('input', req.fiscalPeriodId));

        res.json(result);
    }));

router.route('/inputs/without-invoice')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getAllWithoutInvoice('input', req.query));

        return res.json(result);
    }));

router.route('/inputs/return-sale')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getAllInputsWithIoType('inputBackFromSaleOrConsuming', req.query));

        return res.json(result);
    }));

router.route('/outputs')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getAll(req.fiscalPeriodId, 'output', req.query));

        return res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("inventoryOutputCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/outputs/:id')
    .put(async((req, res) => {

        try {
            req.container.get("CommandBus").send("inventoryOutputUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("inventoryOutputRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/outputs/:id/calculate-price')
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("inventoryOutputCalculatePrice", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/outputs/:id/generate-journal')
    .post(async((req, res) => {

        try {

            const id = req.params.id;

            let journalId = req.container.get("CommandBus").send("journalGenerateForOutputSale", [id]);

            req.container.get("CommandBus").send("inventoryOutputSetJournal", [id, journalId]);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/outputs/max-number')
    .get(async((req, res) => {
        const inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getMaxNumber('output', req.fiscalPeriodId));

        res.json(result);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getById(req.params.id));

        return res.json(result);
    }));

router.route('/outputs/return-purchase')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getAllInputsWithIoType('outputReturnPurchase', req.query));

        return res.json(result);
    }));

router.route('/:id/lines')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getDetailById(req.params.id, req.query));

        return res.json(result);
    }));

router.route('/by-stock/:productId')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId, req.user.id),
            result = await(inventoryQuery.getInventoriesByStock(req.params.productId, req.fiscalPeriodId));

        return res.json(result);
    }));

router.route('/fix-quantity')
    .post(async(function (req, res) {
        try {
            req.container.get("CommandBus").send("inventoryFixQuantity", [req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/pricing')
    .post(async(function (req, res) {
        try {
            const result = req.container.get("CommandBus").send("inventoryPricing", [req.body]);
            if (result && result.idsHasNoPrice)
                return res.json({
                    isValid: false,
                    errors: {inventoryHasNotPrice: new InventoryQuery(req.branchId).getAllByIds(result.idsHasNoPrice)}
                });

            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;