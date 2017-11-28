"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    EventEmitter = instanceOf('EventEmitter'),
    Guid = instanceOf('utility').Guid,
    DetailAccountService = ApplicationService.DetailAccountService,
    DetailAccountQuery = require('../queries/query.detailAccount');

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = RunService('detailAccountCreate', [req.body], req);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService('detailAccountUpdate', [req.params.id, req.body], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService('detailAccountRemove', [req.params.id], req);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/by-subsidiary-ledger-account/:subsidiaryLedgerAccountId')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllBySubsidiryLedgerAccount(
                req.params.subsidiaryLedgerAccountId,
                req.query));
        res.json(result);
    }));

module.exports = router;