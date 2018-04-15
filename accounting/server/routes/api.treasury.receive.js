"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ReceiveQuery = require('../queries/query.treasury.receive'),
    TreasuryPurposesQuery = require('../queries/query.treasury.purpose');

router.route('/')
    .get(async((req, res) => {
        let receiveQuery = new ReceiveQuery(req.branchId),
            result = await(receiveQuery.getAll( req.fiscalPeriodId, req.query));
        res.json(result);
    }));

router.route('/cheques')
    .get(async((req, res) => {
        let receiveQuery = new ReceiveQuery(req.branchId),
            result = await(receiveQuery.getAllCheques(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("treasuryReceiveChequeCreate", [req.body]);
            req.container.get("CommandBus").send("treasuryChequeInFund", [id, req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/cheques/:id')
    .get(async((req, res) => {
        let receiveQuery = new ReceiveQuery(req.branchId),
            result = await(receiveQuery.getById(req.params.id));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send("treasuryReceiveChequeUpdate", [req.params.id, req.body]);
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
            req.container.get("CommandBus").send("treasuryReceiveChequePass", [req.params.id, req.body]);
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

router.route('/cheques/:id/in-fund')
    .put(async((req, res) => {

        try {
            req.container.get("CommandBus").send("treasuryChequeInFund", [req.params.id, req.body]);
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

router.route('/cheques/:id/missing')
    .put(async((req, res) => {

        try {
            req.container.get("CommandBus").send("treasuryChequeMissing", [req.params.id, req.body]);
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

router.route('/cash')
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("treasuryReceiveCashCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/cash/:id')
    .get(async((req, res) => {
        let receiveQuery = new ReceiveQuery(req.branchId),
            result = await(receiveQuery.getById(req.params.id));
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
            let journalId = req.container.get("CommandBus").send("journalGenerateForReceiveCash", [id]);
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
            const id = req.container.get("CommandBus").send("treasuryReceiveReceiptCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/receipts/:id')
    .get(async((req, res) => {
        let receiveQuery = new ReceiveQuery(req.branchId),
            result = await(receiveQuery.getById(req.params.id));
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
            let journalId = req.container.get("CommandBus").send("journalGenerateForReceiveReceipt", [id]);
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
            const id = req.container.get("CommandBus").send("treasuryReceiveDemandNoteCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/demand-notes/:id')
    .get(async((req, res) => {
        let receiveQuery = new ReceiveQuery(req.branchId),
            result = await(receiveQuery.getById(req.params.id));
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
            let journalId = req.container.get("CommandBus").send("journalGenerateForReceiveDemandNote", [id]);
            req.container.get("CommandBus").send("demandNoteSetJournal", [id, journalId]);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));


router.route('/purposes/invoice')
    .post(async((req, res) => {
        try {
            const ids = req.container.get("CommandBus").send("receiveTreasuriesPurposeCreate", [req.body]);
            res.json({isValid: true, returnValue: [ids]});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));


router.route('/purposes/invoice/:id')
    .get(async((req, res) => {
        let treasuryPurposesQuery = new TreasuryPurposesQuery(req.branchId),
            result = await(treasuryPurposesQuery.getByInvoiceId(req.params.id,req.query));
        res.json(result);
    }));


module.exports = router;

