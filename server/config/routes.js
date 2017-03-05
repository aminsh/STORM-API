var express = require('express'),
    passport = require('passport'),
    app = require('./express').app,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knexService = require('../services/knexService'),
    config = require('./'),
    shouldNextRoute = require('../services/shouldNextRoute'),
    authRoute = require('../services/authRoute'),
    branchRoute = require('../services/branchRoute');

var clientTranslation = require('./translate.fa.json');

/*app.use(async(function (req, res, next) {
    if (shouldNextRoute(req, res, next))
        return;

    if (authRoute(req, res, next))
        return;

    if (branchRoute(req, res, next))
        return;


}));*/

var basePath = '../routes';

app.use('/api/users', require('{0}/api.user'.format(basePath)));
app.use('/api/branches', require('{0}/api.branch'.format(basePath)));
app.use('/', require('{0}/api.upload'.format(basePath)));

app.get('*', async(function (req, res) {
    return res.render('index.ejs', {
        clientTranslation: clientTranslation,
        currentUser: req.isAuthenticated() ? req.user.name : '',
        currentBranch: req.cookies['branch-id']
            ? require('../queries/query.branch').getById(req.cookies['branch-id'])
            : false,
        env: process.env.NODE_ENV,
        version: config.version
    });
}));
