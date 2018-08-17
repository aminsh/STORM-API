"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    knex = instanceOf('knex'),
    InvoiceQuery = require('../queries/query.invoice'),
    InvoiceReportQuery = require('../queries/query.report.invoices'),
    TreasuryPurposesQuery = require('../../../application/src/Treasury/TreasuryPurposeQuery'),
    container = require('../../../application/dist/di.config').container,
    parseFiscalPeriod = require('../../../api/parse.fiscalPeriod'),
    Enums = instanceOf('Enums');

function getContainer(req){
    let childContainer = container.createChild();
    childContainer.bind("State").toConstantValue({
        branchId,
        fiscalPeriodId: req.fiscalPeriodId,
        user: 'STORM-API-USER',
        query: {},
        body: {},
        params: {},
        originalUrl: req.originalUrl
    });

    childContainer.bind('HttpContext').toConstantValue({request: req});

    return childContainer;
}

router.route('/:branchId/:invoiceId')
    .get(async(function (req, res) {

        let NotFoundAction = () => res.sendStatus(404),
            branchId = req.params.branchId,
            branch = await(knex.select('id', 'logo', 'name').from('branches').where({id: branchId}).first()),

            thirdPartyPaymentGateways = await(knex.select('id', 'key')
                .from('branchThirdParty')
                .where({branchId})
                .whereIn('key', Enums.ThirdParty().data.filter(item => item.type === 'paymentGateway').map(item => item.key))),
            paymentGateways = Enums.ThirdParty().data.filter(item => thirdPartyPaymentGateways.map(t => t.key).includes(item.key));

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

        res.json({invoice, invoicePrint, receives: receives.data, branch, paymentGateways});

    }));

router.route('/:branchId/:invoiceId/payment-url')
    .get(async(function (req, res) {

        let NotFoundAction = () => res.sendStatus(404),
            branchId = req.params.branchId,
            branch = await(knex.select('id', 'logo', 'name').from('branches').where({id: branchId}).first()),
            paymentGateways = Enums.ThirdParty().data
                .filter(item => item.type === 'paymentGateway')
                .map(item => item.key),
            thirdPartyPaymentGateway = await(knex.select('*')
                .from('branchThirdParty')
                .where({branchId})
                .whereIn('key', paymentGateways)
                .first());

        if (!branch)
            return NotFoundAction();

        let invoiceQuery = new InvoiceQuery(req.params.branchId),
            invoice = invoiceQuery.getById(req.params.invoiceId);

        if (!invoice)
            return NotFoundAction();

        let parameters = {
            returnUrl: `${process.env['ORIGIN_URL']}/v1/send-invoice/return/?original_return_url=${req.query.returnUrl}&branch_id=${branch.id}&invoice_id=${invoice.id}`,
            customerName: invoice.customerDisplay,
            description: 'بابت پرداخت فاکتور شماره ' + invoice.number,
            amount: invoice.sumRemainder,
            referenceId: invoice.id
        };

        let url,
            paymentGatewayFactory = getContainer(req).get("Factory<PaymentGateway>"),
            paymentGatewayService = paymentGatewayFactory(thirdPartyPaymentGateway.key);

        try {
            url = paymentGatewayService.getPaymentUrl(parameters);

            res.redirect(url);
        }
        catch (e) {
            console.log(JSON.stringify(e));

            res.status(400).send(e.statusMessage);
        }
    }));

function returnPaymentHandler(req, res){

}

router.route('/return')
    .get(returnPaymentHandler)
    .post(returnPaymentHandler);

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

        req.branchId = branchId;

        parseFiscalPeriod(req);

        let cmd = {
            reference: 'invoice',
            referenceId: invoice.id,
            treasury: {
                treasuryType: 'receive',
                amount: invoice.sumRemainder,
                documentType: 'receipt',
                payerId: invoice.customer.id,
                receiverId: paypingInfo.data.bankId,
                transferDate: Utility.PersianDate.current(),
                documentDetail: {
                    date: Utility.PersianDate.current(),
                    number: req.body.refid
                }

            }
        };

        try {
            getContainer(req).get("CommandBus").send("receiveTreasuriesPurposeCreate", [cmd]);
            res.sendStatus(200);
        }
        catch (e) {
            console.log(e);
            res.sendStatus(500);
        }

        try {

            if (process.env['NODE_ENV'] !== 'development')
                await(instanceOf('PaymentService', 'payping').savePayment(Object.assign({}, req.body, {userKey: paypingInfo.data.userKey})));
        }
        catch (e) {
            console.log('verify');
            console.log(e);
        }
    }));


module.exports = router;