"use strict";

const memoryService = require('../services/memoryService'),
    //redisClient = require('../services/redisClientService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    database = require('../services/databaseService'),
    eventEmitter = require('../services/eventEmitter');

module.exports = {
    name: 'on-branch-created',

    action: async(data => {
        //let branches = await(redisClient.get('branches'));

        /*memoryService.set('branches', branches);

        let branch = branches.asEnumerable().single(b => b.id == data.branchId);

        let dbConfig = await(database.create(branch));

        eventEmitter.emit('on-db-created', branch, dbConfig);*/
    })
};