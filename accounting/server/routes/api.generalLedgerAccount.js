"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    GeneralLedgerAccountQuery = require('../queries/query.generalLedgerAccount');


router.route('/')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("generalLedgerAccountCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/chart-of-accounts')
    .get(async((req, res) => {
        const generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.chartOfAccount());
        res.json(result);
    }));

router.route('/account-categories')
    .get((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.accountCategory());

        res.json(result);
    });

router.route('/default/chart-of-accounts')
    .get((req, res) => {
        res.json(groups);
    });

router.route('/:id')
    .get(async((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("generalLedgerAccountUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("generalLedgerAccountRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/account-categories')
    .get((req, res) => {
        let generalLedgerAccountQuery = new GeneralLedgerAccountQuery(req.branchId),
            result = await(generalLedgerAccountQuery.accountCategory());

        res.json(result);
    });


module.exports = router;
