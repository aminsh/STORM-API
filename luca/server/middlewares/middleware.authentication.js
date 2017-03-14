"use strict";

const config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Authentication = require('../services/authenticationService');

module.exports = async((req, res, next) => {
    if (req.isAuthenticated())
        return next();

    if (req.originalUrl.startsWith('/auth/return'))
        return next();

    let authentication = new Authentication(req, res);
    authentication.middleware();
});
