"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    knex = instanceOf('knex'),
    InvoiceQuery = require('../queries/query.invoice'),
    InvoiceReportQuery = require('../queries/query.report.invoices'),
    TreasuryPurposesQuery = require('../queries/query.treasury.purpose'),
    container = require('../../../application/dist/di.config').container,
    parseFiscalPeriod = require('../../../api/parse.fiscalPeriod');

router.route('/:branchId/:invoiceId')
    .get(async(function (req, res) {

        let NotFoundAction = () => res.sendStatus(404),
            branchId = req.params.branchId,
            branch = await(knex.select('id', 'logo', 'name').from('branches').where({id: branchId}).first()),
            hasPayping = await(knex.select('id').from('branchThirdParty').where({branchId, key: 'payping'}).first());

        if (!branch)
            return NotFoundAction();

        let invoiceQuery = new InvoiceQuery(req.params.branchId),
            invoiceReportQuery = new InvoiceReportQuery(req.params.branchId),
            invoice = invoiceQuery.getById(req.params.invoiceId),
            invoicePrint = await(invoiceReportQuery.invoice(req.params.invoiceId));

        if (!invoice)
            return NotFoundAction();

        let treasuryPurposesQuery = new TreasuryPurposesQuery(branchId),
            receives = await(treasuryPurposesQuery.getByInvoiceId(invoice.id));

        res.json({invoice, invoicePrint, receives: receives.data, branch, hasPayping: !!hasPayping});

    }));

router.route('/:branchId/:invoiceId/payment-url')
    .get(async(function (req, res) {

        let NotFoundAction = () => res.sendStatus(404),
            branchId = req.params.branchId,
            branch = await(knex.select('id', 'logo', 'name').from('branches').where({id: branchId}).first()),
            paypingInfo = await(knex.select('*').from('branchThirdParty').where({branchId, key: 'payping'}).first());

        if (!branch)
            return NotFoundAction();

        let invoiceQuery = new InvoiceQuery(req.params.branchId),
            invoice = invoiceQuery.getById(req.params.invoiceId);

        if (!invoice)
            return NotFoundAction();

        let parameters = {
            returnUrl: req.query.returnUrl,
            customerName: invoice.customerDisplay,
            description: 'بابت پرداخت فاکتور شماره ' + invoice.number,
            amount: invoice.sumRemainder
        };

        let url;

        try {
            url = await(instanceOf('PaymentService', 'payping').getPaymentUrl(paypingInfo.data.userKey, parameters));

            res.send(url);
        }
        catch (e) {
            console.log(JSON.stringify(e));

            res.status(400).send(e.statusMessage);
        }
    }));

router.route('/:branchId/:invoiceId/record-payment')
    .post(async(function (req, res) {

        let NotFoundAction = () => res.sendStatus(404),
            branchId = req.params.branchId,
            branch = await(knex.select('id', 'logo', 'name').from('branches').where({id: branchId}).first()),
            paypingInfo = await(knex.select('*').from('branchThirdParty').where({branchId, key: 'payping'}).first());

        if (!branch)
            return NotFoundAction();

        let invoiceQuery = new InvoiceQuery(req.params.branchId),
            invoice = invoiceQuery.getById(req.params.invoiceId);

        if (!invoice)
            return NotFoundAction();

        let payementData = process.env['NODE_ENV'] === 'development'
            ? {amount: invoice.sumRemainder, referenceId: '1248'}
            : await(instanceOf('PaymentService', 'payping').savePayment(Object.assign({}, req.body, {userKey: paypingInfo.data.userKey})));

        let childContainer = container.createChild();

        req.branchId = branchId;

        parseFiscalPeriod(req);

        childContainer.bind("State").toConstantValue({
            branchId,
            fiscalPeriodId: req.fiscalPeriodId,
            user: 'STORM-API-USER',
            query: {},
            body: {},
            params: {},
            originalUrl: req.originalUrl
        });

        let cmd = {
            reference: 'invoice',
            referenceId: invoice.id,
            treasury: {
                treasuryType: 'receive',
                amount: payementData.amount,
                documentType: 'receipt',
                payerId: invoice.customer.id,
                receiverId: paypingInfo.data.bankId,
                transferDate: Utility.PersianDate.current(),
                documentDetail: {
                    date: Utility.PersianDate.current(),
                    number: payementData.referenceId
                }

            }
        };

        try {
            childContainer.get("CommandBus").send("receiveTreasuriesPurposeCreate", [cmd]);
            res.sendStatus(200);
        }
        catch (e) {
            console.log(e);
            res.sendStatus(500);
        }

    }));


module.exports = router;