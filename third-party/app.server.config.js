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
    Enums = instanceOf('Enums'),
    thirdPartyRepository = new (require('../storm/server/features/thirdParty/branchThirdPary.repository')),
    thirdPartyQuery = new (require('../storm/server/features/thirdParty/branchThirdParty.query'));


module.exports = app;

app.set('views', __dirname);
app.engine('html', ejs.renderFile);

app.use('/api', (req, res, next) => {
    req.branchId = req.cookies['branch-id'];
    next();
});

app.get('*', async((req, res) => {

    if(!(req.cookies['branch-id']) || !(req.isAuthenticated()))
        return res.redirect("/404");

    res.render('index.ejs',{
        version: config.version,
        translates
    });

}));