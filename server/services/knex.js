"use strict";

const knex = require('knex'),
    memoryService = require('../services/memoryService'),
    config = require('../config');

module.exports = function (branchId) {
    let context = memoryService.get(`context.${branchId}`);
    if (context) return context;

    const dbConfig = memoryService.get('dbConfigs')
        .asEnumerable()
        .single(d => d.branchId == branchId).dbConfig;

    context = knex(dbConfig);

    memoryService.set(`context.${branchId}`, context);

    return context;
};
