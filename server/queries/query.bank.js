"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

class BandQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let query = this.knex.select('*').from('banks');
        return kendoQueryResolve(query, parameters, BankView);
    }

    getById(id) {
        let bank = await(this.knex.select().from('banks').where('id', id).first());
        return new BankView(bank);
    }
}


class BankView {
    constructor(model) {
        this.id = model.id;
        this.title = model.title;
    }
}

module.exports = BandQuery;