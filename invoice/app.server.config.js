"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    ejs = require('ejs'),
    app = express(),
    translates = require('../accounting/server/config/translate.client.fa.json'),
    config = require('../accounting/server/config'),
    reports = require('../accounting/reporting/report.config.json'),
    Crypto = require('../shared/services/cryptoService');


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
    /*let token = req.query.token,
        branchId = req.cookies['branch-id'];

    if (!(token || branchId))
        return res.send('no token');

    if (token) {
        let decryptedToken = Crypto.verify(token);

        if (!decryptedToken) return res.send('no token');

        res.cookie('branch-id', decryptedToken.branchId);
        res.redirect(`/invoice/${decryptedToken.reportId}?id=${decryptedToken.id}`);
        return;
    }

    req.branchId = branchId;*/
    return next();
}));


app.get('*', (req, res) => res.render('invoice.ejs', {
    reports,
    version: config.version,
    translates
}));