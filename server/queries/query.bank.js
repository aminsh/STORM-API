"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = bank => ({id: bank.id, title: bank.title});

class BandQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let query = this.knex.select().from('banks');
        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let bank = await(this.knex.select().from('banks').where('id', id).first());
        return view(bank);
    }
}

module.exports = BandQuery;