"use strict";

const express = require('express'),
    ejs = require('ejs'),
    config = require('./'),
    app = express();


module.exports = app;

app.set('views', config.rootPath + '/server/views');
app.engine('html', ejs.renderFile);
app.use('/content', express.static(config.rootPath + '/client/content'));
app.use('/uploads', express.static(config.rootPath + '/uploads'));
app.use('/reporting', express.static(config.rootPath + '/reporting'));
app.use(require('../middlewares/goToLoginIfNotAuthenticated'));
app.use(require('../middlewares/onUserConnected'));
app.use(require('../middlewares/locals'));
app.use(require('../middlewares/onExceptionError'));

