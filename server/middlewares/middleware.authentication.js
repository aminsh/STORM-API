"use strict";

const config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    routeHandler = require('../utilities/routeHandler');

module.exports = async((req, res, next) => {
    const authenticationService = req.ioc.resolve('authenticationService');

    authenticationService.middleware();
});
