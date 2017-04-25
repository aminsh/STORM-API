"use strict";

const express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    multer = require('multer'),
    favicon = require('serve-favicon'),
    cors = require('cors'),
    flash = require('connect-flash'),
    compression = require('compression'),
    persianDateService = require('../../../shared/services/persianDateService'),
    MemoryStore = require('session-memory-store')(session),
    config = require('./'),
    app = express();

app.use(compression());
app.use(favicon(config.rootPath + 'client/content/images/favicon.ico'));
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(session({
    store: new MemoryStore(),
    name: 'STORM-SESSION',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function (req, res, next) {
    res.locals = {
        isAuthenticated: req.isAuthenticated(),
        user: req.isAuthenticated() ? req.user : null,
        today: persianDateService.current()
    };

    next();
});

app.use(compression());
app.set('views', config.rootPath + '/server/views');
app.engine('html', require('ejs').renderFile);
app.use('/public', express.static(config.rootPath + '../public'));
app.use('/client', express.static(config.rootPath + '/client'));
app.use('/content', express.static(config.rootPath + '/client/content'));
app.use('/data', express.static(config.rootPath + '../data'));
app.use('/', express.static(config.rootPath + '/server/public'));

app.use(multer({dest: './data/uploads/;'}));

module.exports.app = app;
