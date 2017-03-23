"use strict";

const app = require('../config/express').app,
    config = require('../config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BranchQuery = require('../features/branch/branch.query'),
    branchQuery = new BranchQuery(),
    clientTranslation = require('../config/translate.fa.json');

module.exports = async((req, res, next) => {
    let branchId = req.cookies['branch-id'];

    res.locals = {
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.isAuthenticated() ? req.user.name : null,
        currentUserImage: req.isAuthenticated() ? req.user.image : '',
        clientTranslation: clientTranslation,
        currentBranch: branchId
            ? await(branchQuery.getById(branchId))
            : false,
        env: process.env.NODE_ENV,
        version: config.version
    };

    next();
})

