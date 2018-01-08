"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    InventoryQuery = require('../queries/query.inventory');

router.route('/inputs')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getAll('input', req.query));

        return res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService("inventoryInputCreate", [req.body], req);
            res.json({isValid: true, returnValue: {id}})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/products')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getAllInventoryProducts(req.query));

        return res.json(result);
    }));

router.route('/inputs/:id')
    .put(async((req, res) => {

        try {
            RunService("inventoryInputUpdate", [req.params.id, req.body], req);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService("inventoryInputRemove", [req.params.id], req);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/inputs/:id/set-price')
    .put(async((req, res) => {
        try {
            RunService("inventoryInputSetPrice", [req.params.id, req.body], req);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/inputs/:id/fix-quantity')
    .put(async((req, res) => {
        try {
            RunService("inventoryInputFixQuantity", [req.params.id], req);
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

router.route('/outputs')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getAll('output', req.query));

        return res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService("inventoryOutputCreate", [req.body], req);
            res.json({isValid: true, returnValue: {id}})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/outputs/:id')
    .put(async((req, res) => {

        try {
            RunService("inventoryOutputUpdate", [req.params.id, req.body], req);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService("inventoryOutputRemove", [req.params.id], req);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/outputs/:id/calculate-price')
    .put(async((req, res)=> {
        try {
            RunService("inventoryOutputCalculatePrice", [req.params.id], req);
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

            let journalId = RunService("journalGenerateForOutputSale", [id], req);

            RunService("inventoryOutputSetJournal", [id, journalId], req);

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
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getById(req.params.id));

        return res.json(result);
    }));

router.route('/inputs/without-invoice')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getAllWithoutInvoice('input', req.query));

        return res.json(result);
    }));

router.route('/:id/lines')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getDetailById(req.params.id, req.query));

        return res.json(result);
    }));

router.route('/by-stock/:productId')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getInventoriesByStock(req.params.productId, req.fiscalPeriodId));

        return res.json(result);
    }));

module.exports = router;