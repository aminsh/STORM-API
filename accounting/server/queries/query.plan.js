"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');


module.exports = class PlanQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getFreePlan() {
        let query = this.knex.select('*')
            .from('plans')
            .where('cost', 0)
            .first();
        return query;
    }
};



