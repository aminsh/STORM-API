module.exports = function(branchId, branchConfig, memoryService) {

    var knex = memoryService.get('db.read.{0}'.format(branchId));
    if (knex) return knex;


    var dbConfig = branchConfig.db;
    /*
      eco => economic
      pro => professional
    */
    let knex = null;

    if (branchConfig.type == 'eco')
        knex = require('knex.implemented.by.sqllite')(dbConfig);

    if (branchConfig.type == 'pro')
        knex = require('knex.implemented.by.pg')(dbConfig);

    memoryService.set('db.read.{0}'.format(branchId), knex);

    return knex;
};
