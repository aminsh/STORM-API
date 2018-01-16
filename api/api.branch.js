"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),

    /** @type {BranchQuery}*/
    BranchQuery = instanceOf('BranchQuery'),

    /** @type {TokenGenerator}*/
    TokenGenerator = instanceOf('TokenGenerator');

router.use('/', async(function (req, res, next) {
    if(!req.isAuth)
        return res.status(401).send('No Authorized');

    next();

}));
router.route('/')
    .get(async(function (req, res) {
        let branches = BranchQuery.getBranchesByUser(req.user.id);

        res.json(branches);

    }));

module.exports = router;

