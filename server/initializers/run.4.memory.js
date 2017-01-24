"use strict";

var memoryService = require('../services/memoryService'),
    redisClient = require('../services/redisClientService'),
    cryptoService = require('../services/cryptoService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = async(()=> {
    memoryService.set('users', []);

    let branches = await(redisClient.get('branches'));
    memoryService.set('branches', branches);

    let dbConfigs = (await(redisClient.get('accDbConfigs')) || [])
        .asEnumerable()
        .select(e => cryptoService.decrypt(e))
        .toArray();

    memoryService.set('dbConfigs', dbConfigs);
});