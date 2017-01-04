var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var multer = require('multer');
var favicon = require('serve-favicon');
var cors = require('cors');
var flash = require('connect-flash');
var compression = require('compression');
var persianDateService = require('../services/persianDateService');

var MemoryStore = require('session-memory-store')(session);
var config = require('./');
var app = express();

app.use(favicon(config.rootPath + '/client/content/images/favicon.ico'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    store: new MemoryStore(),
    name: 'ADMIN-SESSION',
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
app.use('/client', express.static(config.rootPath + '/client'));
app.use('/content', express.static(config.rootPath + '/client/content'));
app.use('/uploads', express.static(config.rootPath + '/uploads'));

app.use(multer({dest: './uploads/;'}));

module.exports.app = app;
