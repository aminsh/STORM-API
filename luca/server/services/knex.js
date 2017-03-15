"use strict";

const knex = require('knex'),
    memoryService = require('../services/memoryService'),
    config = require('../config');

module.exports = function (branchId) {
    let context = memoryService.get(`context.${branchId}`);
    if (context) return context;

    const branch = memoryService.get('branches')
        .asEnumerable()
        .single(d => d.id == branchId);

    context = knex({
        client: 'pg',
        connection: branch.lucaConnectionId
    });

    memoryService.set(`context.${branchId}`, context);

    return context;
};
