"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
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
            const id = req.container.get("CommandBus").send("subsidiaryLedgerAccountCreate", [req.params.parentId, req.body]);
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
            req.container.get("CommandBus").send("subsidiaryLedgerAccountUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("subsidiaryLedgerAccountRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;
