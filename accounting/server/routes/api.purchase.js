"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    InvoiceQuery = require('../queries/query.invoice'),
    PaymentQuery = require('../queries/query.payment');

router.route('/summary')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getSummary(req.fiscalPeriodId, 'purchase'));

        res.json(result);
    }));

router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getAll(req.query, 'purchase'));

        res.json(result);
    }))
    .post(async((req, res) => {

        try {
            const id = RunService("invoicePurchaseCreate", [req.body], req);

            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors})
        }

    }));

router.route('/:id/confirm')
    .post(async((req, res) => {
        try {
            RunService("invoicePurchaseConfirm", [req.params.id], req);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors})
        }
    }));

router.route('/:id')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getById(req.params.id));

        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            RunService("invoicePurchaseUpdate", [req.params.id, req.body], req);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors})
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService("invoicePurchaseRemove", [req.params.id], req);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors})
        }
    }));


router.route('/:id/pay')
    .post(async((req, res) => {
        try {
            RunService("invoicePurchasePay", [req.params.id, req.body], req);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors})
        }
    }));

router.route('/:id/generate-journal')
    .post(async((req, res) => {

        try {

            const id = req.params.id;

            let journalId = RunService("journalGenerateForInvoicePurchase", [id], req);

            RunService("invoicePurchaseSetJournal", [id, journalId], req);

            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id/payments').get(async((req, res) => {
    let paymentQuery = new PaymentQuery(req.branchId),
        result = await(paymentQuery.getPeymentsByInvoiceId(req.params.id));

    res.json(result);
}));


router.route('/:id/lines').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.branchId),
        result = await(invoiceQuery.getAllLines(req.params.id, req.query));

    res.json(result);
}));

router.route('/max/number')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.maxNumber('purchase'));

        res.json(result.max);
    }));

module.exports = router;








