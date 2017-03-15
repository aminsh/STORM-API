"use strict";

const express = require('express'),
    passport = require('passport'),
    url = require('url'),
    app = require('./express').app,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knexService = require('../services/knexService'),
    config = require('./'),
    memoryService = require('../services/memoryService'),
    cryptoService = require('../services/cryptoService'),
    authRoute = require('../services/authRoute'),
    branchRoute = require('../services/branchRoute');

var clientTranslation = require('./translate.fa.json');

var basePath = '../routes';

app.use('/api/users', require('{0}/api.user'.format(basePath)));
app.use('/api/branches', require('{0}/api.branch'.format(basePath)));
app.use('/api', require('{0}/api.message'.format(basePath)));
app.use('/', require('{0}/api.upload'.format(basePath)));

app.get('/luca-demo', (req, res) => {
    try {
        let token = (url.parse(req.url).query)
                ? url.parse(req.url).query.replace('token=', '')
                : null,
            info = cryptoService.decrypt(token);

        res.cookie('branch-id', info.branchId);

        req.demoUser = info.user;

        let demoUsers = memoryService.get('demoUsers');
        if (!demoUsers.asEnumerable().any(u => u.id == info.user.id))
            demoUsers.push(info.user);

        req.logIn(info.user, err => res.redirect('/luca'));

    } catch (e) {
        debugger;
    }
});
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
