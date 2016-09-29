var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var multer = require('multer');
var favicon = require('serve-favicon');
var cors = require('cors');
var flash = require('connect-flash');

var onUserConnectedMiddleware = require('./../middlewares/middleware.onUserConnected');
var onExceptionErrorMiddleware = require('./../middlewares/middleware.onExceptionError');

var MemoryStore = require('session-memory-store')(session);
var config = require('./config');
var app = express();

app.use(favicon(config.rootPath + '/client/content/images/favicon.ico'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    store: new MemoryStore(),
    name: 'JSESSION',
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set('views', config.rootPath + '/server/views');
app.engine('html', require('ejs').renderFile);
app.use('/client', express.static(config.rootPath + '/client'));
app.use('/content', express.static(config.rootPath + '/client/content'));
app.use('/uploads', express.static(config.rootPath + '/server/uploads'));

app.use(multer({dest: './uploads/;'}));

app.use(onUserConnectedMiddleware);
app.use(onExceptionErrorMiddleware);

module.exports.app = app;
