"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    cors = require('cors'),
    flash = require('connect-flash'),
    compression = require('compression'),
    config = instanceOf('config'),
    app = express(),

    BranchService = require('./branchService'),
    parseFiscalPeriod = require('./parse.fiscalPeriod'),
    container = require('../application/dist/di.config').container,
    knex = instanceOf('knex');

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());

app.use('/api/v1/login', require('./api.login'));
app.use('/api/v1/branches', require('./api.branch'));

app.use(async((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'],

        noTokenProvidedMessage = 'No token provided.';

    if (!token)
        return res.status(403).send(noTokenProvidedMessage);

    let decode = BranchService.findByToken(token);

    if (!(decode && decode.isActive))
        return res.status(403).send(noTokenProvidedMessage);

    req.branchId = decode.branchId;
    req.user = {id: decode.userId};

    parseFiscalPeriod(req);

    let childContainer = container.createChild(),
        transaction = req.method.toUpperCase() !== 'GET'
            ? await(new Promise(resolve => knex.transaction(trx => resolve(trx))))
            : undefined;

    childContainer.bind("State").toConstantValue({
        branchId: req.branchId,
        fiscalPeriodId: req.fiscalPeriodId,
        user: req.user,
        query: req.query,
        body: req.body,
        params: req.params,
        originalUrl: req.originalUrl,
        transaction
    });

    req.container = childContainer;

    next();
}));

app.use('/api/v1/account-review', require('../accounting/server/routes/api.accountReview'));
app.use('/api/v1/detail-accounts', require('../accounting/server/routes/api.detailAccount'));
app.use('/api/v1/api/detail-account-categories', require('../accounting/server/routes/api.detailAccountCategory'));
app.use('/api/v1/banks', require('../accounting/server/routes/api.bank'));
app.use('/api/v1/people', require('../accounting/server/routes/api.people'));
app.use('/api/v1/funds', require('../accounting/server/routes/api.fund'));
app.use('/api/v1/dimensions', require('../accounting/server/routes/api.dimension'));
app.use('/api/v1/dimension-categories', require('../accounting/server/routes/api.dimensionCategory'));
app.use('/api/v1/fiscal-periods', require('../accounting/server/routes/api.fiscalPeriod'));
app.use('/api/v1/general-ledger-accounts', require('../accounting/server/routes/api.generalLedgerAccount'));
app.use('/api/v1/journals', require('../accounting/server/routes/api.journal'));
app.use('/api/v1/journal-templates', require('../accounting/server/routes/api.journalTemplate'));
app.use('/api/v1/subsidiary-ledger-accounts', require('../accounting/server/routes/api.subsidiaryLedgerAccount'));
app.use('/api/v1/tags', require('../accounting/server/routes/api.tag'));
app.use('/api/v1/reports', require('../accounting/server/routes/api.report'));
app.use('/api/v1/sales', require('../accounting/server/routes/api.sale'));
app.use('/api/v1/purchases', require('../accounting/server/routes/api.purchase'));
app.use('/api/v1/products', require('../accounting/server/routes/api.product'));
app.use('/api/v1/product-categories', require('../accounting/server/routes/api.productCategory'));
app.use('/api/v1/settings', require('../accounting/server/routes/api.setting'));
app.use('/api/v1/transfer-money', require('../accounting/server/routes/api.moneyTransfer'));
app.use('/api/v1/receive', require('../accounting/server/routes/api.receive'));
app.use('/api/v1/pay', require('../accounting/server/routes/api.pay'));
app.use('/api/v1/bank-and-fund', require('../accounting/server/routes/api.bankAndFund'));
app.use('/api/v1/scales', require('../accounting/server/routes/api.scale'));
app.use('/api/v1/stocks', require('../accounting/server/routes/api.stock'));
app.use('/api/v1/inventory', require('../accounting/server/routes/api.inventory'));
app.use('/api/v1/inventories', require('../accounting/server/routes/api.inventory'));
app.use('/api/v1/journal-generation-templates', require('../accounting/server/routes/api.journalGenerationTemplate'));
app.use('/api/v1/return-sales', require('../accounting/server/routes/api.returnSale'));

module.exports = app;


