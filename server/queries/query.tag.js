"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

let view = e => ({ id: e.id, title: e.title });

module.exports = class TagQuery extends BaseQuery {
    constructor(knex) {
        super(knex);
    }

    getAll(parameters) {
        let query = knexService.select().from('tags');
        return kendoQueryResolve(query, req.query, view)
    }
};



