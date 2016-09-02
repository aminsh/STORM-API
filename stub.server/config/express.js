var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var multer = require('multer');
var favicon = require('serve-favicon');
var cors = require('cors');
var app = express();
var config = require('./config');

app.use(favicon(config.rootPath + '/client/content/images/favicon.ico'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('views', config.rootPath + '/stub.server/views');
app.engine('html', require('ejs').renderFile);
app.use('/client', express.static(config.rootPath + '/client'));
app.use('/content', express.static(config.rootPath + '/client/content'));
app.use('/partials', express.static(config.rootPath + '/client/partials'));
app.use('/uploads', express.static(config.rootPath + '/stub.server/uploads'));

app.use(multer({dest: './uploads/;'}));


module.exports.app = app;
