"use strict";

const config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = async((req, res, next) => {
    if(config.env = 'development')
        res.cookie('branch-id', config.branchId);

    if (req.isAuthenticated())
        return next();

    let url = `/login?returnUrl=${req.originalUrl}`;
    return res.redirect(url);
});
