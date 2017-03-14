"use strict";

const memoryService = require('../services/memoryService'),
    redisClient = require('../services/redisClientService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = {
    name: 'on-branch-updated',

    action: async(data => {
        let branches = await(redisClient.get('branches'));
        memoryService.set('branches', branches);
    })
};