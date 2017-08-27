"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    ejs = require('ejs'),
    app = express(),
    translates = require('../accounting/server/config/translate.client.fa.json'),
    config = instanceOf('config'),
    reports = require('../accounting/reporting/report.config.json'),
    Crypto = require('../shared/services/cryptoService'),
    PaymentService = instanceOf('PaymentService'),
    translate = instanceOf('translate');


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
            description: translate('For payment invoice number ...').formate(invoice.number),
            returnUrl: `${instanceOf('config').url.origin}/invoice/${invoice.id}/pay/${paymentMethod}/return`
        };

    if(invoice.sumRemainder <= 0)
        return res.status(400).send('مبلغ صحیح نیست');

    instanceOf('PaymentService', req.params.paymentMethod)
        .pay(req.branchId, paymentParameters, res);
}));

app.post('/:id/pay/:paymentMethod/return', (req, res) => {
    let id = req.params.id,
        EventEmitter = instanceOf('EventEmitter'),
        paymentData;

    try {
        paymentData = await(instanceOf('PaymentService', req.params.paymentMethod)
            .savePayment(req.branchId, req.query))
    } catch (e) {
        throw new Error(e);
    }

    const bankId = paymentData.bankId;

    delete paymentData.bankId;

    paymentData.invoiceId = id;

    await(instanceOf('repository.payment').create(paymentData));

    paymentData.bankId = bankId;

    EventEmitter.emit('on-receive-created',
        [paymentData],
        id,
        {branchId: req.branchId, fiscalPeriodId: req.fiscalPeriodId});

    EventEmitter.emit('on-invoice-paid', id, req.branchId);

    res.redirect(`${config.url.origin}/invoice/${req.params.id}`);
});

app.get('*', async((req, res) =>
    res.render('invoice.ejs', {
        reports,
        version: config.version,
        translates,
        currentBranch: await(instanceOf('branch.repository').getById(req.cookies['branch-id']))
    })));