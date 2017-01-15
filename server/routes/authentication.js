"use strict";

var passport = require('passport'),
    config = require('../config'),
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