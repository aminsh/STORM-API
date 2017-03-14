"use strict";

var config = require('../config'),
    memoryService = require('../services/memoryService'),
    redisClient = require('../services/redisClientService'),
    cryptoService = require('../services/cryptoService'),
    rp = require('request-promise'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knexFactory = require('../services/knex');

module.exports = async(() => {
    let options = {
            uri: config.auth.storm.getBranches,
            json: true
        };

    memoryService.set('users', []);

    let branches = config.mode == 'UNIT'
        ? [config.branch]
        : await(rp(options));
    //: await(redisClient.get('branches'));

    memoryService.set('branches', branches);

    /*let dbConfigs = config.mode == 'UNIT'
        ? [{branchId: config.branch.id, dbConfig: config.db}]
        : (await(redisClient.get('accDbConfigs')) || [])
            .asEnumerable()
            .select(e => cryptoService.decrypt(e))
            .toArray();*/

    //memoryService.set('dbConfigs', dbConfigs);
});