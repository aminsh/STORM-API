"use strict";

const app = require('../config/express').app,
    config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    branchQuery = require('../features/branch/branch.query'),
    clientTranslation = require('../config/translate.fa.json');

module.exports = async((req, res, next) => {
    let branchId = req.cookies['branch-id'];

    res.locals = {
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.isAuthenticated() ? req.user.name : null,
        currentUserImage: req.isAuthenticated() ? req.user.image : '',
        currentUserEmail: req.isAuthenticated() ? req.user.email : '',
        clientTranslation: clientTranslation,
        env: config.env,
        version: config.version
    };

    next();
});

