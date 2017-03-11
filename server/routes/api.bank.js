"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    router = require('express').Router(),
    BankRepository = require('../data/repository.bank'),
    BankQuery = require('../queries/query.bank');

router.route('/')
    .get(async((req, res) => {
        let bankQuery = new BankQuery(req.cookies['branch-id']),
            result = await(bankQuery.getAll(req.query));
        res.json(result);
    }))

    .post(async((req, res) => {
        let bankRepository = new BankRepository(req.cookies['branch-id']),
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
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        let entity = await(bankRepository.create({title: cmd.title}));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });

    }));

router.route('/:id')
    .get(async((req, res) => {
        let bankQuery = new BankQuery(req.cookies['branch-id']),
            result = bankQuery.getById(req.params.id);
        res.json(result);
    }))

    .put(async((req, res) => {
        let bankRepository = new BankRepository(req.cookies['branch-id']),
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
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        let entity = await(bankRepository.findById(req.params.id));

        entity.title = cmd.title;

        await(bankRepository.update(entity));

        res.json({isValid: true});
    }))

    .delete(async((req, res) => {
        let bankRepository = new BankRepository(req.cookies['branch-id']),
            errors = [];

        if (errors.asEnumerable().any())
            return res.json({
                isValid: !errors.asEnumerable().any(),
                errors: errors
            });

        await(bankRepository.remove(req.params.id));

        res.json({isValid: true});
    }));

module.exports = router;