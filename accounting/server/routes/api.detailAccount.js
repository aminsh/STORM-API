"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    DetailAccountRepository = require('../data/repository.detailAccount'),
    DetailAccountQuery = require('../queries/query.detailAccount');

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            errors = [],
            cmd = req.body;

        if (!string.isNullOrEmpty(cmd.code)){
            let gla = await(detailAccountRepository.findByCode(cmd.code));

            if (gla)
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
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        let entity = await(detailAccountRepository.create({
            code: cmd.code,
            title: cmd.title
        }));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }));

router.route('/:id')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(detailAccountRepository.findByCode(cmd.code, cmd.id));

            if (gla)
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

        let entity = await(detailAccountRepository.findById(cmd.id));

        entity.title = cmd.title;
        entity.code = cmd.code;

        await(detailAccountRepository.update(entity));

        return res.json({isValid: true});
    }))
    .delete(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.branchId),
            errors = [];

        //check for journal line
        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(detailAccountRepository.remove(req.params.id));

        return res.json({isValid: true});
    }));

router.route('/:id/activate').put(async((req, res) => {
    let detailAccountRepository = new DetailAccountRepository(req.branchId),
        entity = await(detailAccountRepository.findById(req.params.id));

    entity.isActive = true;

    await(detailAccountRepository.update(entity));

    return res.json({isValid: true});
}));

router.route('/:id/deactivate').put(async((req, res) => {
    let detailAccountRepository = new DetailAccountRepository(req.branchId),
        entity = await(detailAccountRepository.findById(req.params.id));

    entity.isActive = false;

    await(detailAccountRepository.update(entity));

    return res.json({isValid: true});
}));

module.exports = router;