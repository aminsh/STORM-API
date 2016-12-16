var express = require('express'),
    passport = require('passport'),
    app = require('./express').app,
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knexService = require('../services/knexService'),
    config = require('./');


var clientTranslation = require('./translate.fa.json');
app.use(async(function (req, res, next) {
    if (req.originalUrl.startsWith('/uploads'))
        return next();

    if (req.originalUrl.startsWith('/auth')) {
        var returnUrl = req.query.returnUrl;

        if (req.isAuthenticated())
            res.redirect(returnUrl);

        res.cookie('return-url', returnUrl);
        return res.redirect('/login');
    }

    if (req.xhr)
        return next();

    return res.render('index.ejs', {
        clientTranslation: clientTranslation,
        currentUser: req.isAuthenticated() ? req.user.name : '',
        currentBranch: req.cookies['branch-id'] ? require('../queries/query.branch').getById(req.cookies['branch-id']) : false,
        env: process.env.NODE_ENV,
        version: config.version
    });
}));


/*app.get('/auth/provider/callback',
 passport.authenticate('devstorm-auth', {
 successRedirect: '/',
 failureRedirect: '/login'
 }));*/

var basePath = '../routes';

app.use('/api/users', require('{0}/api.user'.format(basePath)));
app.use('/api/branches', require('{0}/api.branch'.format(basePath)));
app.use('/', require('{0}/api.upload'.format(basePath)));



