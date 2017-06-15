"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ChequeCategoryRepository = require('../data/repository.chequeCategory'),
    ChequeCategoryQuery = require('../queries/query.chequeCategory');

router.route('/')
    .get(async((req, res) => {
        let chequeCategoryQuery = new ChequeCategoryQuery(req.branchId),
            result = await(chequeCategoryQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let chequeCategoryRepository = new ChequeCategoryRepository(req.branchId),
            errors = [],
            cmd = req.body;

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        let cheques = [],
            lastPageNumber = cmd.firstPageNumber + cmd.totalPages - 1;

        for (let i = cmd.firstPageNumber; i <= lastPageNumber; i++)
            cheques.push({
                number: i,
                status: 'White'
            });

        let entity = {
            bankId: cmd.bankId,
            detailAccountId: cmd.detailAccountId,
            totalPages: cmd.totalPages,
            firstPageNumber: cmd.firstPageNumber,
            lastPageNumber: lastPageNumber,
            isClosed: false,
            cheques: cheques
        };

        entity = await(chequeCategoryRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }));

router.route('/detail-account/:detailAccountId/opens')
    .get(async((req, res) => {
        let chequeCategoryQuery = new ChequeCategoryQuery(req.branchId),
            result = await(chequeCategoryQuery.getOpens(req.params.detailAccountId));
        res.json(result);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let chequeCategoryQuery = new ChequeCategoryQuery(req.branchId),
            result = await(chequeCategoryQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let chequeCategoryRepository = new ChequeCategoryRepository(req.branchId),
            errors = [],
            cmd = req.body;

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        let entity = await(chequeCategoryRepository.findById(req.params.id));

        entity.bankId = cmd.bankId;
        entity.detailAccountId = cmd.detailAccountId;

        await(chequeCategoryRepository.update(entity));

        res.json({isValid: true});
    }))
    .delete(async((req, res) => {
        let chequeCategoryRepository = new ChequeCategoryRepository(req.branchId),
            errors = [],
            id = req.params.id,
            hasCheque = await(chequeCategoryRepository.hasCheque(id));

        if (hasCheque)
            errors.push('This chequeCategory has cheque , You can not remove it');

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(chequeCategoryRepository.remove(req.params.id));

        res.json({isValid: true});
    }));

module.exports = router;