"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

class ScaleQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(parameters) {
        let query = this.knex.select()
            .from('scales')
            .where('branchId', this.branchId);

        return kendoQueryResolve(query, parameters,
            item => ({id: item.id, title: item.title}));
    }
}

module.exports = ScaleQuery;