"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    app = express(),

    /**
     * @type {BranchService} */
    BranchService = instanceOf('BranchService'),

    /** @type {UserQuery}*/
    UserQuery = instanceOf('UserQuery'),
    parseFiscalPeriod = require('./parse.fiscalPeriod'),
    container = require('../application/dist/di.config').container,
    knex = instanceOf('knex');


module.exports = app;

app.use(async(function (req, res, next) {

    let userToken = req.headers["authorization"];

    if (!userToken)
        return next();

    let user = UserQuery.getByToken(userToken);

    if (!user)
        return next();

    req.user = user;
    req.isAuth = true;

    next();
}));

app.use('/login', require('./api.login'));
app.use('/branches', require('./api.branch'));

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


app.use('/account-review', require('../accounting/server/routes/api.accountReview'));

app.use('/detail-accounts', require('../accounting/server/routes/api.detailAccount'));
app.use('/banks', require('../accounting/server/routes/api.bank'));
app.use('/people', require('../accounting/server/routes/api.people'));
app.use('/funds', require('../accounting/server/routes/api.fund'));

app.use('/dimensions', require('../accounting/server/routes/api.dimension'));
app.use('/dimension-categories', require('../accounting/server/routes/api.dimensionCategory'));
app.use('/fiscal-periods', require('../accounting/server/routes/api.fiscalPeriod'));
app.use('/general-ledger-accounts', require('../accounting/server/routes/api.generalLedgerAccount'));
app.use('/journals', require('../accounting/server/routes/api.journal'));
app.use('/journal-lines', require('../accounting/server/routes/api.journalLine'));
app.use('/journal-templates', require('../accounting/server/routes/api.journalTemplate'));
app.use('/subsidiary-ledger-accounts', require('../accounting/server/routes/api.subsidiaryLedgerAccount'));
app.use('/tags', require('../accounting/server/routes/api.tag'));
app.use('/reports', require('../accounting/server/routes/api.report'));
app.use('/sales', require('../accounting/server/routes/api.sale'));
app.use('/purchases', require('../accounting/server/routes/api.purchase'));
app.use('/products', require('../accounting/server/routes/api.product'));
app.use('/product-categories', require('../accounting/server/routes/api.productCategory'));
app.use('/settings', require('../accounting/server/routes/api.setting'));
app.use('/transfer-money', require('../accounting/server/routes/api.moneyTransfer'));
app.use('/receive', require('../accounting/server/routes/api.receive'));
app.use('/pay', require('../accounting/server/routes/api.pay'));
app.use('/bank-and-fund', require('../accounting/server/routes/api.bankAndFund'));
app.use('/scales', require('../accounting/server/routes/api.scale'));
app.use('/inventory', require('../accounting/server/routes/api.inventory'));

