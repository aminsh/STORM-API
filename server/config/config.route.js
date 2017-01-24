"use strict";

var app = require('./config.express').app,
    express = require('express'),
    fileSystemService = require('../services/fileSystemService'),
    routeHandler = require('../utilities/routeHandler'),
    path = require('path'),
    config = require('./'),
    request = require('request');

var basePath = '/routes';
/* config Routes */
app.use('/api/account-review', require('../routes/api.accountReview'));
app.use('/api/banks', require('../routes/api.bank'));
app.use('/api/cheques', require('../routes/api.cheques'));
app.use('/api/cheque-categories', require('../routes/api.chequeCategory'));
app.use('/api/detail-accounts', require('../routes/api.detailAccount'));
app.use('/api/dimensions', require('../routes/api.dimension'));
app.use('/api/dimension-categories', require('../routes/api.dimensionCategory'));
app.use('/api/fiscal-periods', require('../routes/api.fiscalPeriod'));
app.use('/api/general-ledger-accounts', require('../routes/api.generalLedgerAccount'));
app.use('/api/jounals', require('../routes/api.journal'));
app.use('/api/jounal-lines', require('../routes/api.journalLine'));
app.use('/api/journal-templates', require('../routes/api.journalTemplate'));
app.use('/api/subsidiary-ledger-account', require('../routes/api.accountReview.subsidiaryLedgerAccount'));
app.use('/api/tags', require('../routes/api.tag'));

fileSystemService.getDirectoryFiles(basePath)
    .forEach(file => {
        var fileName = file.replace(path.extname(file), ''),
            prefix = fileName.split('.').length > 1 ? fileName.split('.')[0] : '',
            expressRouter = express.Router(),
            routers = require(`../${basePath}/${fileName}`);

        if (!Array.isArray(routers)) return;

        routers.forEach(route => expressRouter
            .route(route.path)[route.method.toLowerCase()]((req, res) => routeHandler(req, route.handler)));

        app.use(`/${prefix}`, expressRouter);
    });

app.get('/logo', (req, res) => {
    "use strict";
    var options = {
        uri: config.branch.logoUrl.format(req.cookies['branch-id']),
        method: 'GET'
    };
    var r = request(options);
    req.pipe(r);
    r.pipe(res);
});

app.get('/branch/change', (req, res) => {
    "use strict";
    var url = `${config.branch.changeUrl}/?returnUrl=${config.auth.returnUrl}`;
    res.redirect(url);
});








