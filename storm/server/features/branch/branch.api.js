"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    branchRepository = new require('./branch.repository'),
    branchQuery = require('./branch.query');


router.route('/').post(async((req, res) => {
    let cmd = req.body;

    await(branchRepository.create(cmd));

    res.body({isValid: true});
}));

router.route('/current').get(async((req, res) => {
    let currentBranch = await(branchQuery.getById(req.cookies['branch-id']));
    res.json(currentBranch);
}));

router.route('/my').get(async((req, res) => {
    let branches = branchQuery.getBranchesByUser(req.user.id);
    res.json(branches);
}));

module.exports = router;