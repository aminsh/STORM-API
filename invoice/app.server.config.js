"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    ejs = require('ejs'),
    app = express(),
    translates = require('../accounting/server/config/translate.client.fa.json'),
    config = require('../accounting/server/config'),
    reports = require('../accounting/reporting/report.config.json'),
    Crypto = require('../shared/services/cryptoService'),
    PaymentService = instanceOf('PaymentService');


module.exports = app;

app.set('views', __dirname);
app.engine('html', ejs.renderFile);

app.use('/api', (req, res, next) => {
    req.branchId = req.cookies['branch-id'];
    next();
});

app.use('/api/reports', require('../accounting/server/routes/api.report'));
app.use('/api/sales', require('../accounting/server/routes/api.sale'));

app.use(async((req, res, next) => {
    const branchId = req.cookies['branch-id'];

    if (!branchId) return next();

    req.fiscalPeriodId = await(instanceOf('query.fiscalPeriod', branchId).getMaxId());
    req.branchId = branchId;

    return next();
}));

app.get('/token/:token', async((req, res) => {

    let token = req.params.token;
    let tokenObj = Crypto.verify(token);
    let branchId = tokenObj.branchId;
    let invoiceId = tokenObj.invoiceId;

    res.cookie('branch-id', branchId);
    res.redirect(`/invoice/${invoiceId}`);

}));

app.get('/:id/pay/:paymentMethod', async((req, res) => {
    const paymentMethod = req.params.paymentMethod,
        invoice = await(instanceOf('query.invoice', req.branchId).getById(req.params.id)),
        paymentParameters = {
            customerName: invoice.detailAccountDisplay,
            amount: invoice.sumRemainder,
            returnUrl: `${instanceOf('config').url.origin}/invoice/${invoice.id}/pay/${paymentMethod}/return`
        };

    instanceOf('PaymentService', req.params.paymentMethod)
        .pay(req.branchId, paymentParameters, res);
}));

app.get('/:id/pay/:paymentMethod/return', (req, res) => {
    let id = req.params.id,
        EventEmitter = instanceOf('EventEmitter'),
        verifyData = await(instanceOf('PaymentService', req.params.paymentMethod)
            .verify(req.branchId, req.query)),

        payment = {
            number: verifyData.referenceId,
            date: instanceOf('utility').PersianDate.current(),
            invoiceId: req.params.id,
            amount: verifyData.amount,
            paymentType: 'receipt',
            receiveOrPay: 'receive'
        };

    await(instanceOf('repository.payment').create(payment));

    EventEmitter.emit('on-receive-created',
        [payment],
        id,
        {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});

    EventEmitter.emit('on-invoice-paid', req.params.id, req.branchId);

    res.redirect(`${config.url.origin}/invoice/${req.params.id}`);
});

app.get('*', async((req, res) =>
    res.render('invoice.ejs', {
        reports,
        version: config.version,
        translates,
        currentBranch: await(require('../storm/server/features/branch/branch.repository').getById(req.cookies['branch-id']))
    })));