"use strict";

const config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = async((req, res, next) => {
    if (req.isAuthenticated())
        return next();

    let url = `/login?returnUrl=${req.originalUrl}`;
    return res.redirect(url);
});
