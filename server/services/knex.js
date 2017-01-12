"use strict";

const knex = require('knex');

module.exports = function(branchId, branchConfig, memoryService) {
    let context = memoryService.get(`context.${branchId}`);
    if (context) return context;

    const dbConfig = branchConfig.db;
    
    context = knex(dbConfig);

    memoryService.set(`context.${branchId}`, context);

    return context;
};
