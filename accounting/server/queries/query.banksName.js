"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');


class BanksName extends BaseQuery {

    constructor(branchId) {
        super(branchId);
    }

    getAll(parameters) {
        let query = this.knex.from('banksName');

        return await(kendoQueryResolve(query, parameters, item => ({id: item.id, title: item.title})));
    }
}

module.exports = BanksName;