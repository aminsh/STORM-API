var express = require('express');
var models = require('../models');
var passport = require('passport');
var app = require('./express').app;


var clientTranslation = require('./translate.client.fa.json')

function checkAuth(req, res, next) {
    if (req.isAuthenticated() || req.originalUrl == '/login')
        return next();

    if (req.xhr)
        return res.status(401).send('user is not authenticated');

    return res.redirect('/login');
}

app.use(checkAuth);

app.get('/', function (req, res) {
    res.render('index.ejs', {
        clientUrl: 'http://dev-storm:1024',
        clientTranslation: clientTranslation
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/login', function (req, res) {
    res.render('login.ejs');
});

/*app.get('/auth/provider/callback',
 passport.authenticate('devstorm-auth', {
 successRedirect: '/',
 failureRedirect: '/login'
 }));*/

var basePath = '../routes';

var generalLedgerAccountApi = require('{0}/api.generalLedgerAccount'.format(basePath));
var subsidiaryLedgerAccountApi = require('{0}/api.subsidiaryLedgerAccount'.format(basePath));
var detailAccountApi = require('{0}/api.detailAccount'.format(basePath));
var dimensionCategoryApi = require('{0}/api.dimensionCategory'.format(basePath));
var dimensionApi = require('{0}/api.dimension'.format(basePath));
/*var journalApi = require('{0}/journalApi'.format(basePath));
 var journalLineApi = require('{0}/journalLineApi'.format(basePath));*/

app.use('/api', generalLedgerAccountApi);
app.use('/api', subsidiaryLedgerAccountApi);
app.use('/api', detailAccountApi);
app.use('/api', dimensionCategoryApi);
app.use('/api', dimensionApi);
/*app.use('/api',journalApi);
 app.use('/api',journalLineApi);*/


