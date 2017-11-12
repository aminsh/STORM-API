"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    InventoryDomain = require('../domain/inventory'),
    InventoryQuery = require('../queries/query.inventory'),
    DomainException = instanceOf('domainException');

router.route('/inputs')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getAll('input', req.query));

        return res.json(result);
    }))
    .post(async((req, res) => {
        let cmd = req.body;

        const inventoryDomain = new InventoryDomain(req.branchId, req.fiscalPeriodId);

        cmd.inventoryType = 'input';

        try {
            const id = await(inventoryDomain.create(cmd));
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            if (e instanceof DomainException)
                return res.json({isValid: false, errors: e.errors});

            console.log(e);

            res.json({isValid: false, errors: ['System error']});
        }

    }));

router.route('/products')
    .get(async((req,res)=> {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getAllInventoryProducts(req.query));

        return res.json(result);
    }));

router.route('/inputs/:id')
    .put(async((req, res) => {

        const inventoryDomain = new InventoryDomain(req.branchId, req.fiscalPeriodId);

        try {
            await(inventoryDomain.update(req.params.id, req.body));
            res.json({isValid: true});
        }
        catch (e) {
            if (e instanceof DomainException)
                return res.json({isValid: false, errors: e.errors});

            console.log(e);

            res.json({isValid: false, errors: ['System error']});
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
        let cmd = req.body;

        const inventoryDomain = new InventoryDomain(req.branchId, req.fiscalPeriodId);

        cmd.inventoryType = 'output';

        try {
            await(inventoryDomain.create(cmd));
            res.json({isValid: true});
        }
        catch (e) {
            if (e instanceof DomainException)
                return res.json({isValid: false, errors: e.errors});

            console.log(e);

            res.json({isValid: false, errors: ['System error']});
        }

    }));

router.route('/outputs/:id')
    .put(async((req, res) => {

        const inventoryDomain = new InventoryDomain(req.branchId, req.fiscalPeriodId);

        try {
            await(inventoryDomain.update(req.params.id, req.body));
            res.json({isValid: true});
        }
        catch (e) {
            if (e instanceof DomainException)
                return res.json({isValid: false, errors: e.errors});

            console.log(e);

            res.json({isValid: false, errors: ['System error']});
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

router.route('/:id/lines')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getDetailById(req.params.id, req.query));

        return res.json(result);
    }));

router.route('/add-to-first-input')
    .post(async((req, res) => {
        let inventoryDomain = new InventoryDomain(req.branchId, req.fiscalPeriodId),
            cmd = req.body;

        try {
            await(inventoryDomain.addProductToInputFirst(cmd));
            return res.json({isValid: true});
        }
        catch (e) {
            if (e instanceof DomainException)
                return res.json({isValid: false, errors: e.errors});

            return res.json({isValid: false, errors: ['System error']});
        }

    }));

router.route('/by-stock/:productId')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getInventoriesByStock(req.params.productId, req.fiscalPeriodId));

        return res.json(result);
    }));

module.exports = router;