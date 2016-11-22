var express = require('express');
var passport = require('passport');
var app = require('./express').app;
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var knexService = require('../services/knexService');
var view = require('../viewModel.assemblers/view.dimensionCategory');
var config = require('./config');


var clientTranslation = require('./translate.client.fa.json');

function checkAuth(req, res, next) {
    if (req.isAuthenticated() || req.originalUrl == '/login' || req.originalUrl.startsWith('/register'))
        return next();

    if (req.xhr)
        return res.status(401).send('user is not authenticated');

    return res.redirect('/login');
}

app.use(checkAuth);

app.get('/', function (req, res) {
    var dimensionCategories = await(knexService.select().from('dimensionCategories'));
    var mappedDimensionCategories = {data: dimensionCategories.asEnumerable().select(view).toArray()};

    res.render('index.ejs', {
        clientTranslation: clientTranslation,
        currentUser: req.user.name,
        dimensionCategories: mappedDimensionCategories,
        version: config.version
    });
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/login', function (req, res) {
    res.render('login.ejs', {
        error: req.flash('error')
    });
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


/*app.get('/auth/provider/callback',
 passport.authenticate('devstorm-auth', {
 successRedirect: '/',
 failureRedirect: '/login'
 }));*/

var basePath = '../routes';

app.use('/register', require('{0}/api.registerUser'.format(basePath)));

var generalLedgerAccountApi = require('{0}/api.generalLedgerAccount'.format(basePath));
var subsidiaryLedgerAccountApi = require('{0}/api.subsidiaryLedgerAccount'.format(basePath));
var detailAccountApi = require('{0}/api.detailAccount'.format(basePath));
var dimensionCategoryApi = require('{0}/api.dimensionCategory'.format(basePath));
var dimensionApi = require('{0}/api.dimension'.format(basePath));
var journalApi = require('{0}/api.journal'.format(basePath));
var journalLineApi = require('{0}/api.journalLine'.format(basePath));
var chequeCategoryApi = require('{0}/api.chequeCategory'.format(basePath));
var bankApi = require('{0}/api.bank'.format(basePath));
var chequeApi = require('{0}/api.cheque'.format(basePath));
var fiscalPeriod = require('{0}/api.fiscalPeriod'.format(basePath));
var journalTemplateApi = require('{0}/api.journalTemplate'.format(basePath));
var accoutReviewApi = require('{0}/api.accountReview'.format(basePath));
var tagApi = require('{0}/api.tag'.format(basePath));


app.use('/api', generalLedgerAccountApi);
app.use('/api', subsidiaryLedgerAccountApi);
app.use('/api', detailAccountApi);
app.use('/api', dimensionCategoryApi);
app.use('/api', dimensionApi);
app.use('/api', journalApi);
app.use('/api', journalLineApi);
app.use('/api', chequeCategoryApi);
app.use('/api', bankApi);
app.use('/api', chequeApi);
app.use('/api', fiscalPeriod);
app.use('/api', journalTemplateApi);
app.use('/api', accoutReviewApi);
app.use('/api', tagApi);

app.use('/report', require('{0}/report.journal'.format(basePath)));
app.use('/report', require('{0}/report.designer'.format(basePath)));


