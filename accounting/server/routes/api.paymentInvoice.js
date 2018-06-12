const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    InvoiceQuery = require('../queries/query.invoice'),
    container = require('../../../application/dist/di.config').container,
    parseFiscalPeriod = require('../../../api/parse.fiscalPeriod'),
    queryString = require('query-string');

function getContainer(req) {
    req.branchId = req.query.branch_id;
    parseFiscalPeriod(req);

    let childContainer = container.createChild();
    childContainer.bind("State").toConstantValue({
        branchId: req.branchId,
        fiscalPeriodId: req.fiscalPeriodId,
        user: {id: 'STORM-API-USER'},
        query: {},
        body: {},
        params: {},
        originalUrl: req.originalUrl
    });

    return childContainer;
}

router.route('/:invoiceId')
    .get(async(function (req, res) {
        let invoiceId = req.params.invoiceId,
            branchId = req.query.branch_id,
            originalReturnUrl = req.query.return_url || '/',
            paymentGateway = req.query.payment_gateway,
            invoiceQuery = new InvoiceQuery(req.query.branch_id),

            invoice = invoiceQuery.getById(invoiceId),
            paymentGatewayFactory = getContainer(req).get("Factory<PaymentGateway>"),
            qs = {
                payment_gateway: paymentGateway,
                original_return_url: originalReturnUrl,
                branch_id: branchId
            },
            url = paymentGatewayFactory(paymentGateway).getPaymentUrl({
                returnUrl: `${process.env.ORIGIN_URL}/v1/payment-invoice/${invoiceId}/return/?${Object.keys(qs).map(key => `${key}=${qs[key]}`).join('&')}`,
                payerName: invoice.customerDisplay,
                description: 'بابت فاکتور شماره {0}  به تاریخ {1}'.format(invoice.number, invoice.date),
                amount: invoice.sumRemainder,
                referenceId: invoice.id
            });

        res.redirect(url);
    }));

router.route('/:invoiceId/return')
    .get(async(function (req, res) {
        let invoiceId = req.params.invoiceId,
            originalReturnUrl = req.query.original_return_url || '/',
            getReturnUrl = params => {
                let parse = queryString.parseUrl(originalReturnUrl),
                    qs = queryString.stringify(Object.assign({}, parse.query, params));

                return `${parse.url}?${qs}`;
            },
            paymentGateway = req.query.payment_gateway,
            invoiceQuery = new InvoiceQuery(req.query.branch_id),

            invoice = invoiceQuery.getById(invoiceId),
            paymentGatewayFactory = getContainer(req).get("Factory<PaymentGateway>"),

            result = paymentGatewayFactory(paymentGateway).verificate(Object.assign({}, req.query, {Amount: invoice.sumRemainder / 10}));

        if (!result.success)
            return res.redirect(getReturnUrl({status: 'fail'}));

        let cmd = {
            reference: 'invoice',
            referenceId: invoice.id,
            treasury: {
                treasuryType: 'receive',
                amount: result.amount,
                documentType: 'receipt',
                payerId: invoice.customer.id,
                receiverId: result.accountId,
                transferDate: Utility.PersianDate.current(),
                documentDetail: {
                    date: Utility.PersianDate.current(),
                    number: result.referenceId
                }

            }
        };

        try {
            getContainer(req).get("CommandBus").send("receiveTreasuriesPurposeCreate", [cmd]);
            res.redirect(getReturnUrl({status: 'success'}));
        }
        catch (e) {
            console.log(e);
            res.redirect(getReturnUrl({status: 'paidButNotRecorded'}));
        }

    }));

module.exports = router;