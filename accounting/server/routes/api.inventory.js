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
    }));

router.route('/outputs')
    .get(async((req, res) => {
        let inventoryQuery = new InventoryQuery(req.branchId),
            result = await(inventoryQuery.getAll('output', req.query));

        return res.json(result);
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