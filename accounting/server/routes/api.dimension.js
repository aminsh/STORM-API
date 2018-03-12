"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    string = Utility.String,
    translate = require('../services/translateService'),
    router = require('express').Router(),
    DimensionRepository = require('../data/repository.dimension'),
    DimensionQuery = require('../queries/query.dimension');

router.route('/category/:categoryId')
    .get(async((req, res) => {
        let dimensionQuery = new DimensionQuery(req.branchId),
            result = await(dimensionQuery.getAll(req.params.categoryId, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let dimensionRepository = new DimensionRepository(req.branchId),
            errors = [],
            cmd = req.body,
            categoryId = req.params.categoryId;

        if (!string.isNullOrEmpty(cmd.code)) {
            let dimension = await(dimensionRepository.findByCode(cmd.code, categoryId));

            if (dimension)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        let entity = await(dimensionRepository.create({
            dimensionCategoryId: categoryId,
            code: cmd.code,
            title: cmd.title,
            description: cmd.description,
            isActive: true
        }));

        return res.json({
            isValid: true,
            returnValue: { id: entity.id }
        });
    }));

router.route('/:id')
    .get(async((req, res) => {
        let dimensionQuery = new DimensionQuery(req.branchId),
            result = await(dimensionQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let dimensionRepository = new DimensionRepository(req.branchId),
            errors = [],
            cmd = req.body;

        if (!string.isNullOrEmpty(cmd.code)) {
            var dimension = await(dimensionRepository.findByCode(cmd.code, cmd.dimensionCategoryId, cmd.id));

            if (dimension)
                errors.push(translate('The code is duplicated'));
        }

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The title is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        var entity = await(dimensionRepository.findById(cmd.id));

        entity.title = cmd.title;
        entity.code = cmd.code;
        entity.description = cmd.description;

        await(dimensionRepository.update(entity));

        return res.json({ isValid: true });
    }))
    .delete(async((req, res) => {
        let dimensionRepository = new DimensionRepository(req.branchId);
        await(dimensionRepository.remove(req.params.id));

        return res.json({ isValid: true });
    }));

router.route('/:id/activate').put(async((req, res) => {
    let dimensionRepository = new DimensionRepository(req.branchId),
        entity = await(dimensionRepository.findById(req.params.id));

    entity.isActive = true;

    await(dimensionRepository.update(entity));

    return res.json({ isValid: true });
}));
router.route('/:id/deactivate').put(async((req, res) => {
    let dimensionRepository = new DimensionRepository(req.branchId),
        entity = await(dimensionRepository.findById(req.params.id));

    entity.isActive = false;

    await(dimensionRepository.update(entity));

    return res.json({ isValid: true });
}));

module.exports = router;