"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    InvoiceQuery = require('../queries/query.invoice'),
    PaymentQuery = require('../queries/query.payment'),
    Crypto = require('../services/shared').service.Crypto,
    config = instanceOf('config'),
    md5 = require('md5'),
    Email = instanceOf('Email'),
    render = instanceOf('htmlRender').renderFile,
    branchRepository = instanceOf('branch.repository');


router.route('/summary')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getSummary(req.fiscalPeriodId, 'sale'));

        res.json(result);
    }));

router.route('/summary/by-month').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.branchId),
        result = await(invoiceQuery.getTotalByMonth(req.fiscalPeriodId, 'sale'));

    res.json(result);
}));

router.route('/summary/by-product').get(async((req, res) => {
    let invoiceQuery = new InvoiceQuery(req.branchId),
        result = await(invoiceQuery.getTotalByProduct(req.fiscalPeriodId, 'sale'));

    res.json(result);
}));


router.route('/')
    .get(async((req, res) => {
        let invoiceQuery = new InvoiceQuery(req.branchId),
            result = await(invoiceQuery.getAll(req.query, 'sale'));

        res.json(result);
    }))

    .post(async((req, res) => {

        try {

            const id = RunService("invoiceCreate", [req.body], req);

            res.json({isValid: true, returnValue: {id}});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id/confirm')
    .post(async((req, res) => {
        try {
            RunService("invoiceConfirm", [req.params.id], req);

            res.json({isValid: true});
        }
        catch (e){
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
            RunService("invoiceUpdate", [req.params.id, req.body], req);

            res.json({isValid: true});
        }
        catch (e){
            res.json({isValid: false, errors: e.errors})
        }
    }))
    .delete(async((req, res) => {
        try {
            RunService("invoiceRemove", [req.params.id], req);

            res.json({isValid: true});
        }
        catch (e){
            res.json({isValid: false, errors: e.errors})
        }
    }));

router.route('/:id/pay')
    .post(async((req, res) => {

        try {

            RunService("invoicePay", [req.params.id, req.body], req);
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors})
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
            result = await(invoiceQuery.maxNumber('sale'));

        res.json(result.max);
    }));

router.route('/:invoiceId/send-email')
    .post(async((req, res) => {

        let invoiceQuery,
            userEmail,
            invoiceId,
            invoice,
            branchId,
            branch,
            token,
            link;

        // Initialize Variables
        try {

            invoiceQuery = new InvoiceQuery(req.branchId);
            userEmail = req.body.email;
            invoiceId = req.params.invoiceId;
            invoice = await(invoiceQuery.getById(invoiceId));
            branchId = req.branchId;
            branch = await(branchRepository.getById(branchId));
            token = Crypto.sign({
                branchId: branchId,
                invoiceId: invoiceId
            });
            link = `${config.url.origin}/invoice/token/${token}`;

        } catch (err) {
            console.log(err);
            console.log("Invoice ID: " + req.params.invoiceId);
            console.log(`> ERROR: Wrong invoice id`);
            return res.json({isValid: false});
        }

        // Send Email
        try {

            let html = await(render("/accounting/server/templates/send.invoice.template.ejs", {
                invoiceUrl: link,
                branchLogo: branch.logo,
                branchName: branch.name,
                date: invoice.date,
                number: invoice.number,
                detailAccountDisplay: invoice.detailAccountDisplay
            }));

            await(Email.send({
                from: config.email.from,
                to: userEmail,
                subject: `فاکتور شماره ی ${invoice.number} از طرف ${branch.name}`,
                html: html
            }));

            return res.json({isValid: true});

        } catch (err) {
            console.log(`Error: The email DIDN'T send successfuly !!! `, err);
            return res.json({isValid: false});
        }

    }));

module.exports = router;











