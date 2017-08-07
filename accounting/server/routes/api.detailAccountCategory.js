"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    DetailAccountCategoryRepository = require('../data/repository.detailAccountCategory'),
    DetailAccountCategoryQuery = require('../queries/query.detailAccountCategory');

router.route('/')
    .get(async((req, res) => {
        let detailAccountCategoryQuery = new DetailAccountCategoryQuery(req.branchId),
            result = await(detailAccountCategoryQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let detailAccountCategoryRepository = new DetailAccountCategoryRepository(req.branchId),
            errors = [],
            cmd = req.body;


        let subsidiaryLedgerAccountIds = cmd.subsidiaryLedgerAccountIds.join('|'),
            entity = {
                title: cmd.title,
                subsidiaryLedgerAccountIds
            };

        await(detailAccountCategoryRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }));

router.route('/:id')
    .get(async((req, res) => {
        let detailAccountCategoryQuery = new DetailAccountCategoryQuery(req.branchId),
            result = await(detailAccountCategoryQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let detailAccountCategoryRepository = new DetailAccountCategoryRepository(req.branchId),
            errors = [],
            id = req.params.id,
            cmd = req.body,

            subsidiaryLedgerAccountIds = cmd.subsidiaryLedgerAccountIds.join('|');

        await(detailAccountCategoryRepository.update(id, {title: cmd.title, subsidiaryLedgerAccountIds}));

        return res.json({isValid: true});
    }))
    .delete(async((req, res) => {
        let detailAccountCategoryRepository = new DetailAccountCategoryRepository(req.branchId),
            errors = [];

        await(detailAccountCategoryRepository.remove(req.params.id));

        return res.json({isValid: true});
    }));


module.exports = router;