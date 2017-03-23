"use strict";

const config = require('../config'),
    memoryService = require('../services/memoryService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BranchQuery = require('../../../storm/server/features/branch/branch.query'),
    branchQuery = new BranchQuery();

module.exports = async(() => {

    memoryService.set('users', []);

    let branches = config.mode == 'UNIT'
        ? [config.branch]
        : await(branchQuery.getAll());

    memoryService.set('branches', branches);
});