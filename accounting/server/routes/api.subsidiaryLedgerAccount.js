"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    SubsidiaryLedgerAccountService = ApplicationService.SubsidiaryLedgerAccountService,
    Guid = instanceOf('utility').Guid,
    EventEmitter = instanceOf('EventEmitter'),
    router = require('express').Router(),
    SubsidiaryLedgerAccountQuery = require('../queries/query.subsidiaryLedgerAccount');

router.route('/').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAll(req.query));
    res.json(result);
}));

router.route('/incomes').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAllIcome(req.query));
    res.json(result);
}));

router.route('/expenses').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAllExpense(req.query));
    res.json(result);
}));

router.route('/account/:id').get(async((req, res) => {
    let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
        result = await(subsidiaryLedgerAccountQuery.getAll(req.params.id));
    res.json(result);
}));

router.route('/general-ledger-account/:parentId')
    .get(async((req, res) => {
        let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
            result = await(subsidiaryLedgerAccountQuery.getAllByGeneralLedgerAccount(req.params.parentId, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService("generalLedgerAccountCreate", [req.params.parentId, req.body], req);
            res.json({isValid: true, returnValue: {id}})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:id')
    .get(async((req, res) => {
        let subsidiaryLedgerAccountQuery = new SubsidiaryLedgerAccountQuery(req.branchId),
            result = await(subsidiaryLedgerAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService("generalLedgerAccountUpdate", [req.params.id, req.body], req);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService("generalLedgerAccountRemove", [req.params.id], req);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;
