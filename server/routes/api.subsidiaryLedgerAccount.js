"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    journalRepository = require('../data/repository.journal'),
    SubsidiaryLedgerAccountRepository = require('../data/repository.subsidiaryLedgerAccount'),
    SubsidiaryLedgerAccountQuery = require('../queries/query.subsidiaryLedgerAccount');

router.route('/').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.cookies['branch-id']),
        result = await(subsidiaryLedgerAccountQuery.getAll(req.query));
    res.json(result);
}));

router.route('/general-ledger-account/:parentId')
    .get(async((req, res) => {
        let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.cookies['branch-id']),
            result = await(subsidiaryLedgerAccountQuery.getAllByGeneralLedgerAccount(req.params.parentId, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The code is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (!string.isNullOrEmpty(cmd.code)) {
            var sla = await(repository.findByCode(cmd.code, cmd.generalLedgerAccountId, cmd.id));

            if (sla)
                errors.push(translate('The code is duplicated'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        let entity = await(subsidiaryLedgerAccountRepository.findById(cmd.id));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.isBankAccount = cmd.isBankAccount;
        entity.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;
        entity.dimension1AssignmentStatus = cmd.dimension1AssignmentStatus;
        entity.dimension2AssignmentStatus = cmd.dimension2AssignmentStatus;
        entity.dimension3AssignmentStatus = cmd.dimension3AssignmentStatus;

        await(subsidiaryLedgerAccountRepository.update(entity));

        return res.json({ isValid: true });
    }));

router.route('/:id')
    .get(async((req, res) => {
        let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.cookies['branch-id']),
            result = await(subsidiaryLedgerAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        let subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body;

        if (string.isNullOrEmpty(cmd.title))
            errors.push(translate('The code is required'));
        else {
            if (cmd.title.length < 3)
                errors.push(translate('The title should have at least 3 character'));
        }

        if (!string.isNullOrEmpty(cmd.code)) {
            var sla = await(repository.findByCode(cmd.code, cmd.generalLedgerAccountId, cmd.id));

            if (sla)
                errors.push(translate('The code is duplicated'));
        }

        if (errors.asEnumerable().any())
            return res.json({
                isValid: false,
                errors: errors
            });

        let entity = await(subsidiaryLedgerAccountRepository.findById(cmd.id));

        entity.code = cmd.code;
        entity.title = cmd.title;
        entity.isBankAccount = cmd.isBankAccount;
        entity.detailAccountAssignmentStatus = cmd.detailAccountAssignmentStatus;
        entity.dimension1AssignmentStatus = cmd.dimension1AssignmentStatus;
        entity.dimension2AssignmentStatus = cmd.dimension2AssignmentStatus;
        entity.dimension3AssignmentStatus = cmd.dimension3AssignmentStatus;

        await(subsidiaryLedgerAccountRepository.update(entity));

        return res.json({ isValid: true });
    }))
    .delete(async((req, res) => {
        let subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(req.cookies['branch-id']),
            errors = [],
            cmd = req.body;

        // check has journalLine data

        await(subsidiaryLedgerAccountRepository.remove(req.params.id));

        return res.json({ isValid: true });
    }));

router.route('/:id/activate').put(async((req, res) => {
    let subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(req.cookies['branch-id']),
        errors = [],
        entity = await(subsidiaryLedgerAccountRepository.findById(req.params.id));

    entity.isActive = true;

    await(subsidiaryLedgerAccountRepository.update(entity));

    return res.json({ isValid: true });
}));
router.route('/:id/deactivate').put(async((req, res) => {
     let subsidiaryLedgerAccountRepository = new SubsidiaryLedgerAccountRepository(req.cookies['branch-id']),
        errors = [],
        entity = await(subsidiaryLedgerAccountRepository.findById(req.params.id));

    entity.isActive = false;

    await(subsidiaryLedgerAccountRepository.update(entity));

    return res.json({ isValid: true });
}));

module.exports = router;
