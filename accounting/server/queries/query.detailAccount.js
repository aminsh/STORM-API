"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.detailAccount');


module.exports = class DetailAccountQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex;

        let query = knex.select().from(function () {
            this.select(knex.raw("*,code || ' ' || title as display"))
                .from('detailAccounts').as('baseDetailAccounts');
        }).as('baseDetailAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let detailAccount = await(this.knex.select().from('detailAccounts').where('id', id).first());
        return view(detailAccount);
    }
};