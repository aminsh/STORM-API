"use strict";

const redisClient = require('../services/redisClient'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = {
    name: 'on-branch-updated',
    action(branch) {
        let branches = await(redisClient.get('branches')),
            branchesEnumerable = branches.asEnumerable();

        branchesEnumerable.remove(
            branchesEnumerable.firstOrDefault(b => b.id == branch.id));

        branches.push(branch);

        redisClient.set('branches', branches);
        redisClient.publish('on-branch-updated', branch);
    }
};