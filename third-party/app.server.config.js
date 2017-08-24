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
    Enums = instanceOf('Enums');

let thirdParty = [
    {
        key: "PayPing",
        display: "پی پینگ"
    }
];



module.exports = app;

app.set('views', __dirname);
app.engine('html', ejs.renderFile);

app.use('/api', (req, res, next) => {
    req.branchId = req.cookies['branch-id'];
    next();
});

app.get('*', async((req, res) => {

    res.render('index.ejs',{
        version: config.version,
        translates
    });

}));