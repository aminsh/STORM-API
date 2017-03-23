"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    branchRepository = new require('./branch.repository'),
    branchQuery = new require('./branch.query');


router.route('/').post(async((req, res) => {
    let cmd = req.body;

    await(branchRepository.create(cmd));

    res.body({isValid: true});
}));

module.exports = router;