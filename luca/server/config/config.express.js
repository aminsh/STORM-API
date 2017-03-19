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
    persianDateService = require('../services/persianDateService'),
    MemoryStore = require('session-memory-store')(session),
    config = require('./'),
    ejs = require('ejs'),
    app = module.exports = express();

app.use(favicon(config.rootPath + '/client/content/images/favicon.ico'));
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(cookieParser());
app.use(session({
    store: new MemoryStore(),
    name: 'ACC-SESSION',
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
app.engine('html', ejs.renderFile);
app.use('/client', express.static(config.rootPath + 'client'));
app.use('/content', express.static(config.rootPath + '/client/content'));
app.use('/uploads', express.static(config.rootPath + '/uploads'));

app.use(multer({dest: './uploads/;'}));

app.use(require('../middlewares/middleware.authentication'));
app.use(require('../middlewares/middleware.onUserConnected'));
app.use(require('../middlewares/middleware.onExceptionError'));

