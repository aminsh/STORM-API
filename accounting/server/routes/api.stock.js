"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    StockRepository = require('../data/repository.stock'),
    StockQuery = require('../queries/query.stock');

router.route('/')
    .get(async((req, res) => {
        let stockQuery = new StockQuery(req.branchId),
            result = await(stockQuery.getAll(req.query));

        res.json(result);
    }))
    .post(async((req, res) => {
        let stockRepository = new StockRepository(req.branchId),
            entity = {
                title: req.body.title
            };

        await(stockRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));

router.route('/:id')
    .get(async((req, res) => {
        let stockQuery = new StockQuery(req.branchId),
            result = await(stockQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        let stockRepository = new StockRepository(req.branchId),
            id = req.params.id,
            cmd = req.body,
            entity = {
                title: cmd.title,
                address: cmd.address
            };

        await(stockRepository.update(id, entity));

        res.json({isValid: true});
    }))
    .delete(async((req, res) => {
        let stockRepository = new StockRepository(req.branchId),
            id = req.params.id,
            errors = [],
            isUsedOnInventory = await(stockRepository.isUsedOnInventory(id));

        if (isUsedOnInventory)
            errors.push('انبار جاری قبلا در رسید یا حواله استفاده شده است ، امکان حذف وجود ندارد');

        if (errors.length > 0)
            return res.json({isValid: false, errors});

        await(stockRepository.remove(id));

        res.json({isValid: true});
    }));

module.exports = router;