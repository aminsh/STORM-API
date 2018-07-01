"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    //favicon = require('serve-favicon'),
    cors = require('cors'),
    flash = require('connect-flash'),
    compression = require('compression'),
    ejs = require('ejs'),
    config = instanceOf('config'),
    app = express(),

    /**@type {BranchService}*/branchService = instanceOf('branchService'),
    parseFiscalPeriod = require('./parse.fiscalPeriod'),
    container = require('../application/dist/di.config').container,
    knex = instanceOf('knex');

app.use('/swagger', express.static(__dirname + '/../swagger'));

app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());

app.use(function (req, res, next) {

    req.apiCaller = req.headers['api-caller'] || 'External api';

    let childContainer = container.createChild();

    childContainer.bind("State").toConstantValue({
        user: req.user,
        query: req.query,
        body: req.body,
        params: req.params,
        apiCaller: req.apiCaller,
        originalUrl: req.originalUrl
    });

    req.container = childContainer;

    req.container.bind('HttpContext').toConstantValue({request: req});

    next();
});

app.use('/v1/send-invoice', require('../accounting/server/routes/api.sendInvoice'));
app.use('/v1/payment-invoice', require('../accounting/server/routes/api.paymentInvoice'));


function registerRoutes() {

    app.use(async((req, res, next) => {

        const token = req.body.token || req.query.token || req.headers['x-access-token'],

            noTokenProvidedMessage = 'No token provided.',
            NoTokenAction = (message) => res.status(403).send(message || noTokenProvidedMessage);

        if (!token)
            return res.status(403).send(noTokenProvidedMessage);

        let member = branchService.findByToken(token);

        if (!member)
            return NoTokenAction();

        let result = req.container.get("BranchValidateService").validate(member.branchId, req.apiCaller, req.originalUrl);

        if (!result.canExecute)
            return NoTokenAction(result.message);

        /*if (!branchService.isActive(member.branchId))
            return NoTokenAction();*/

        req.branchId = member.branchId;
        req.user = {id: member.userId};

        parseFiscalPeriod(req);

        let childContainer = container.createChild();

        childContainer.bind("State").toConstantValue({
            branchId: req.branchId,
            fiscalPeriodId: req.fiscalPeriodId,
            user: req.user,
            query: req.query,
            body: req.body,
            params: req.params,
            originalUrl: req.originalUrl,
            method: req.method,
            apiCaller: req.apiCaller,
        });

        req.container = childContainer;

        next();
    }));

    //app.use('/v1/third-party', require('./api.thirdParty'));
    app.use('/v1/account-review', require('../accounting/server/routes/api.accountReview'));
    app.use('/v1/detail-accounts', require('../accounting/server/routes/api.detailAccount'));
    app.use('/v1/detail-account-categories', require('../accounting/server/routes/api.detailAccountCategory'));
    app.use('/v1/banks', require('../accounting/server/routes/api.bank'));
    app.use('/v1/people', require('../accounting/server/routes/api.people'));
    app.use('/v1/funds', require('../accounting/server/routes/api.fund'));
    app.use('/v1/dimensions', require('../accounting/server/routes/api.dimension'));
    app.use('/v1/dimension-categories', require('../accounting/server/routes/api.dimensionCategory'));
    app.use('/v1/fiscal-periods', require('../accounting/server/routes/api.fiscalPeriod'));
    app.use('/v1/general-ledger-accounts', require('../accounting/server/routes/api.generalLedgerAccount'));
    app.use('/v1/journals', require('../accounting/server/routes/api.journal'));
    app.use('/v1/journal-templates', require('../accounting/server/routes/api.journalTemplate'));
    app.use('/v1/subsidiary-ledger-accounts', require('../accounting/server/routes/api.subsidiaryLedgerAccount'));
    app.use('/v1/tags', require('../accounting/server/routes/api.tag'));
    app.use('/v1/reports', require('../accounting/server/routes/api.report'));
    app.use('/v1/sales', require('../accounting/server/routes/api.sale'));
    app.use('/v1/purchases', require('../accounting/server/routes/api.purchase'));
    app.use('/v1/products', require('../accounting/server/routes/api.product'));
    app.use('/v1/product-categories', require('../accounting/server/routes/api.productCategory'));
    app.use('/v1/settings', require('../accounting/server/routes/api.setting'));
    app.use('/v1/bank-and-fund', require('../accounting/server/routes/api.bankAndFund'));
    app.use('/v1/scales', require('../accounting/server/routes/api.scale'));
    app.use('/v1/stocks', require('../accounting/server/routes/api.stock'));
    app.use('/v1/inventories', require('../accounting/server/routes/api.inventory'));
    app.use('/v1/journal-generation-templates', require('../accounting/server/routes/api.journalGenerationTemplate'));
    app.use('/v1/return-sales', require('../accounting/server/routes/api.returnSale'));
    app.use('/v1/inventory-io-types', require('../accounting/server/routes/api.inventoryIOType'));
    app.use('/v1/banks-name', require('../accounting/server/routes/api.banksName'));
    app.use('/v1/treasury/receives', require('../accounting/server/routes/api.treasury.receive'));
    app.use('/v1/treasury/payments', require('../accounting/server/routes/api.treasury.payment'));
    app.use('/v1/treasury/transfers', require('../accounting/server/routes/api.treasury.transfer'));
    app.use('/v1/treasury/settings', require('../accounting/server/routes/api.treasury.setting'));
    app.use('/v1/cheque-categories', require('../accounting/server/routes/api.chequeCategory'));
    app.use('/v1/return-purchase', require('../accounting/server/routes/api.returnPurchase'));
    app.use('/v1/permissions', require('../accounting/server/routes/api.permissions'));

    app.use(async(function (err, req, res, next) {

        if (err instanceof ValidationException)
            return invalidHandler(err.errors);

        if (err instanceof ValidationSingleException)
            return invalidHandler(err.message);

        if(err instanceof NotFoundException)
            res.sendStatus(404);

        res.sendStatus(500);

        req.container.get("LoggerService").error(err);

        function invalidHandler(error) {

            res.status(400).send(error);

            if(req.noLog) return;

            req.container.get("LoggerService").invalid(error);
        }
    }));
}

module.exports = {app, registerRoutes};

