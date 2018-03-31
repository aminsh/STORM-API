"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    PaymentQuery = require('../queries/query.treasury.payment');

router.route('/')
    .get(async((req, res) => {
        let paymentQuery = new PaymentQuery(req.branchId),
            result = await(paymentQuery.getAll( req.fiscalPeriodId, req.query));
        res.json(result);
    }));

router.route('/cheques')
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("treasuryPaymentChequeCreate", [req.body]);
            req.container.get("CommandBus").send("treasuryChequeInProcess", [id, req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/cheques/:id')
    .get(async((req, res) => {
        let paymentQuery = new PaymentQuery(req.branchId),
            result = await(paymentQuery.getById(req.params.id, 'cheque'));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryPaymentChequeUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryChequeRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/cheques/:id/pass')
    .put(async((req, res) => {

        try {
            req.container.get("CommandBus").send("treasuryPaymentChequePass", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/cheques/:id/in-process')
    .put(async((req, res) => {

        try {
            req.container.get("CommandBus").send("treasuryChequeInProcess", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/cheques/:id/return')
    .put(async((req, res) => {

        try {
            req.container.get("CommandBus").send("treasuryChequeReturn", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/cheques/:id/revocation')
    .put(async((req, res) => {

        try {
            req.container.get("CommandBus").send("treasuryChequeRevocation", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/cheques/:id/generate-journal')
    .post(async((req, res) => {

        try {

            const id = req.params.id;
            let journalId = req.container.get("CommandBus").send("journalGenerateForCheque", [id]);
            req.container.get("CommandBus").send("chequeSetJournal", [id, journalId]);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/spend-cheques')
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("treasuryChequeSpend", [req.params.id, req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/cash')
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("treasuryPaymentCashCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/cash/:id')
    .get(async((req, res) => {
        let paymentQuery = new PaymentQuery(req.branchId),
            result = await(paymentQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryCashUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryCashRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/cash/:id/generate-journal')
    .post(async((req, res) => {

        try {

            const id = req.params.id;
            let journalId = req.container.get("CommandBus").send("journalGenerateForPaymentCash", [id]);
            req.container.get("CommandBus").send("cashSetJournal", [id, journalId]);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/receipts')
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("treasuryPaymentReceiptCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/receipts/:id')
    .get(async((req, res) => {
        let paymentQuery = new PaymentQuery(req.branchId),
            result = await(paymentQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryReceiptUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryReceiptRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/receipts/:id/generate-journal')
    .post(async((req, res) => {

        try {

            const id = req.params.id;
            let journalId = req.container.get("CommandBus").send("journalGenerateForPaymentReceipt", [id]);
            req.container.get("CommandBus").send("receiptSetJournal", [id, journalId]);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/demand-notes')
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("treasuryPaymentDemandNoteCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/demand-notes/:id')
    .get(async((req, res) => {
        let paymentQuery = new PaymentQuery(req.branchId),
            result = await(paymentQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryDemandNoteUpdate", [req.params.id, req.body]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryDemandNoteRemove", [req.params.id]);
            res.json({isValid: true})
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/demand-notes/:id/generate-journal')
    .post(async((req, res) => {

        try {

            const id = req.params.id;
            let journalId = req.container.get("CommandBus").send("journalGenerateForPaymentDemandNote", [id]);
            req.container.get("CommandBus").send("demandNoteSetJournal", [id, journalId]);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

module.exports = router;

