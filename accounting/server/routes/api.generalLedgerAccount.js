"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    string = require('../utilities/string'),
    router = require('express').Router(),
    GeneralLedgerAccountRepository = require('../data/repository.generalLedgerAccount'),
    GeneralLedgerAccountQuery = require('../queries/query.generalLedgerAccount'),
    translate = require('../services/translateService');

router.route('/')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.cookies['branch-id']),
            result = await(generalLedgerAccountQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(generalLedgerAccountRepository.findByCode(cmd.code));

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

        let entity = {
            code: cmd.code,
            title: cmd.title,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
            isActive: true
        };

        entity = await(generalLedgerAccountRepository.create(entity));

        return res.json({
            isValid: true,
            returnValue: {id: entity.id}
        });
    }));

router.route('/:id')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.cookies['branch-id']),
            result = await(generalLedgerAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body,
            id = req.params.id;

        if (string.isNullOrEmpty(cmd.code))
            errors.push(translate('The code is required'));
        else {
            var gla = await(generalLedgerAccountRepository.findByCode(cmd.code, id));

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

        let entity = {
            id,
            title: cmd.title,
            code: cmd.code,
            postingType: cmd.postingType,
            balanceType: cmd.balanceType,
            description: cmd.description,
        };

        await(generalLedgerAccountRepository.update(entity));

        return res.json({isValid: true});
    }))
    .delete(async((req, res) => {
        let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body,
            gla = await(generalLedgerAccountRepository.findById(req.params.id));

        if (gla.subsidiaryLedgerAccounts.asEnumerable().any())
            errors
                .push(translate('The Current Account has Subsidiary ledger account'));

        //check for journal line

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        await(generalLedgerAccountRepository.remove(req.params.id));

        return res.json({isValid: true});
    }));

router.route('/:id/activate').put(async((req, res) => {
    let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.cookies['branch-id']),
        entity = await(generalLedgerAccountRepository.findById(req.params.id));

    entity.isActive = true;

    await(generalLedgerAccountRepository.update(entity));

    return res.json({isValid: true});
}));

router.route('/:id/deactivate').put(async((req, res) => {
    let generalLedgerAccountRepository = new GeneralLedgerAccountRepository(req.cookies['branch-id']),
        entity = await(generalLedgerAccountRepository.findById(req.params.id));

    entity.isActive = false;

    await(generalLedgerAccountRepository.update(entity));

    return res.json({isValid: true});
}));


module.exports = router;