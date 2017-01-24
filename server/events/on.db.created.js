"use strict";

const cryptoService = require('../services/cryptoService'),
    memoryService = require('../services/memoryService'),
    redisClient = require('../services/redisClientService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports.name = 'on-db-created';

module.exports.action = async((branch, dbConfig) => {
    let accDbConfigs = await(redisClient.get('accDbConfigs'));

    accDbConfigs.push({
        branchId: branch.id,
        db: dbConfig
    });

    redisClient.set('accDbConfigs', accDbConfigs);
    memoryService.set('dbConfigs', accDbConfigs);
});