"use strict";

var config = require('../config'),
    memoryService = require('../services/memoryService'),
    redisClient = require('../services/redisClientService'),
    cryptoService = require('../services/cryptoService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = async(()=> {
    memoryService.set('users', []);

    let branches = config.mode == 'UNIT'
        ? [config.branch]
        : await(redisClient.get('branches'));

    memoryService.set('branches', branches);

    let dbConfigs = config.mode == 'UNIT'
        ? [{branchId: config.branch.id, dbConfig: config.db}]
        : (await(redisClient.get('accDbConfigs')) || [])
        .asEnumerable()
        .select(e => cryptoService.decrypt(e))
        .toArray();

    memoryService.set('dbConfigs', dbConfigs);
});