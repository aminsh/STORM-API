"use strict";

var config = require('../config'),
    memoryService = require('../services/memoryService'),
    rp = require('request-promise'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    branchQuery = require('../../../storm/server/queries/query.branch');

module.exports = async(() => {

    memoryService.set('users', []);

    let branches = config.mode == 'UNIT'
        ? [config.branch]
        : await(branchQuery.getAll());

    memoryService.set('branches', branches);
});