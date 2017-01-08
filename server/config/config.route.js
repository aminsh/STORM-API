var app = require('./config.express').app,
    express = require('express'),
    fileSystemService = require('../services/fileSystemService'),
    routeHandler = require('../utilities/routeHandler'),
    path = require('path'),
    config = require('./'),
    request = require('request');

var basePath = '/routes';

fileSystemService.getDirectoryFiles(basePath)
    .forEach(file => {
        var fileName = file.replace(path.extname(file), ''),
            prefix = fileName.split('.').length > 1 ? fileName.split('.')[0] : '',
            expressRouter = express.Router(),
            routers = require(`../${basePath}/${fileName}`);

        if (!Array.isArray(routers)) return;

        routers.forEach(route => expressRouter
            .route(route.path)[route.method.toLowerCase()]((req, res)=> routeHandler(req, route.handler)));

        app.use(`/${prefix}`, expressRouter);
    });

app.get('/logo', (req,res)=>{
    "use strict";
    var options = {
        uri: config.branch.logoUrl.format(req.cookies['branch-id']),
        method: 'GET'
    };
    var r = request(options);
    req.pipe(r);
    r.pipe(res);
});

app.get('/branch/change', (req, res)=> {
    "use strict";
    var url = `${config.branch.changeUrl}/?returnUrl=${config.auth.returnUrl}`;
    res.redirect(url);
});








