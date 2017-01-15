"use strict";

var passport = require('passport'),
    url = require('url'),
    config = require('../config'),
    cryptoServivce = require('../services/cryptoService'),
    router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/auth/return',
    handler: authenticationService => authenticationService.authenticate()
});

router.route({
    method: 'GET',
    path: '/logout',
    handler: authenticationService => authenticationService.logout()
});

module.exports = router.routes;