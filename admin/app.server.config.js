"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    ejs = require('ejs'),
    config = require('../accounting/server/config'),
    app = express();

module.exports = app;

app.set('views', __dirname);
app.engine('html', ejs.renderFile);

app.use(async((req, res, next) => {
    if(!req.isAuthenticated())
        return res.redirect(`/login?returnUrl=${req.originalUrl}`);

    if(req.user.role != 'admin')
        return res.send('You are not authorized');

    next();
}));

app.get('*', (req, res) => res.render('admin.ejs',{
    version: config.version,
    events: require("../application/events/events.json"),
    services: require("../application/config.services.json"),
}));