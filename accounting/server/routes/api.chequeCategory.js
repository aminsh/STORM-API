"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ChequeCategoryQuery = require('../queries/query.chequeCategory');

router.route('/')
    .get(async((req, res) => {
        let chequeCategoryQuery = new ChequeCategoryQuery(req.branchId),
            result = await(chequeCategoryQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("payableChequeCategoryCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/:bankId/cheque-number')
    .get(async(function (req, res) {
        let chequeCategoryQuery = new ChequeCategoryQuery(req.branchId),
            result = await(chequeCategoryQuery.getCheque(req.params.bankId));
        res.json(result);
    }));

router.route('/detail-account/:detailAccountId/opens')
    .get(async((req, res) => {
        let chequeCategoryQuery = new ChequeCategoryQuery(req.branchId),
            result = await(chequeCategoryQuery.getOpens(req.params.detailAccountId));
        res.json(result);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let chequeCategoryQuery = new ChequeCategoryQuery(req.branchId),
            result = await(chequeCategoryQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("payableChequeCategoryUpdate", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("payableChequeCategoryRemove", [req.params.id]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;