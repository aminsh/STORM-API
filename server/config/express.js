var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var multer = require('multer');
var favicon = require('serve-favicon');
var cors = require('cors');
var onUserConnectedMiddleware = require('./onUserConnectedMiddleware');

var MemoryStore = require('session-memory-store')(session);


module.exports = function (app, config) {
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

    app.set('views', config.rootPath + '/server/views');
    app.engine('html', require('ejs').renderFile);
    app.use('/core', express.static(config.rootPath + '/core'));
    app.use('/acc', express.static(config.rootPath + '/accounting'));
    app.use('/content', express.static(config.rootPath + '/client/content'));
    app.use('/uploads', express.static(config.rootPath + '/uploads'));

    app.use(multer({dest: './uploads/;'}));

    //app.use(onUserConnectedMiddleware);


}
