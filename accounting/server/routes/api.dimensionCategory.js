"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    router = require('express').Router(),
    DimensionCategoryRepository = require('../data/repository.dimensionCategory'),
    DimensionCategoryQuery = require('../queries/query.dimensionCategory');

router.route('/')
    .get(async((req, res) => {
        let dimensionCategoryQuery = new DimensionCategoryQuery(req.branchId),
            result = await(dimensionCategoryQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let dimensionCategoryRepository = new DimensionCategoryRepository(req.branchId),
            errors = [],
            cmd = req.body;

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

        var entity = await(dimensionCategoryRepository.create({
            title: cmd.title
        }));

        return json({
            isValid: true,
            returnValue: { id: entity.id }
        });
    }));

router.route('/:id')
    .get(async((req, res) => {
        let dimensionCategoryQuery = new DimensionCategoryQuery(req.branchId),
            result = dimensionCategoryQuery.getById(req.params.id);
        res.json(result);
    }))
    .put(async((req, res) => {
        let dimensionCategoryRepository = new DimensionCategoryRepository(req.branchId),
            errors = [],
            cmd = req.body;

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

        var entity = await(dimensionCategoryRepository.findById(cmd.id));

        entity.title = cmd.title;

        await(dimensionCategoryRepository.update(entity));

        return res.json({ isValid: true });
    }))
    .delete(async((req, res) => {
        let dimensionCategoryRepository = new DimensionCategoryRepository(req.branchId),
            errors = [],
            cmd = req.body;

        await(dimensionCategoryRepository.remove(req.params.id));

        return res.json({ isValid: true });
    }));

module.exports = router;

