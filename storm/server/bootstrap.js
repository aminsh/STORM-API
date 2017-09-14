"use strict";

const express = require('express'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    multer = require('multer'),
    favicon = require('serve-favicon'),
    cors = require('cors'),
    flash = require('connect-flash'),
    compression = require('compression'),
    MemoryStore = require('session-memory-store')(session),
    config = instanceOf('config'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

module.exports.app = app;
module.exports.server = server;
module.exports.io = io;

app.use(compression());
app.use(favicon(config.rootPath + '/public/images/favicon.ico'));
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

ejs.filters.translate = key => require('./config/translate.fa.json')[key];

app.use(compression());
app.set('views', config.rootPath + '/storm/server/views');
app.engine('html', ejs.renderFile);
app.use('/public', express.static(config.rootPath + '/public'));
app.use('/data', express.static(config.rootPath + '/data'));

if (config.env !== 'dedicated') {
    app.use('/assets', express.static(config.rootPath + '/server/views/webSite/assets'));
    app.use('/images', express.static(config.rootPath + '/server/views/webSite/images'));
    app.use('/', express.static(config.rootPath + '/storm/server/views/webSite'));
}


app.use(multer({dest: './data/uploads/;'}));

/*require('raven').config('https://50b4d5bc2a994b1c981dca42cd56013b:530f0521a04c4090b8174c157927d65b@sentry.io/192057')
    .install();*/

require('./bootstrap.authentication');
require('./bootstrap.events');



