"use strict";

const //redisClient = require('../services/redisClient'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = {
    name: 'on-branch-created',
    action(branch) {
        //let branches = await(redisClient.get('branches'));

            //branches.push(branch);

           /* redisClient.set('branches', branches);
            redisClient.publish('on-branch-created', branch);*/
    }
};