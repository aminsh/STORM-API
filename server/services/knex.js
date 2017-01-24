"use strict";

const knex = require('knex'),
    dbConfig = require('./dbConfigService');

module.exports = function (branchId) {
    let context = memoryService.get(`context.${branchId}`);
    if (context) return context;

    const dbConfig = dbConfig.get(branchId);

    context = knex(dbConfig);

    memoryService.set(`context.${branchId}`, context);

    return context;
};
