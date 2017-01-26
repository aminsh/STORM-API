"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.generalLedgerAccount');

module.exports = class GeneralLedgerAccountQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex;
        let query = knex.select().from(function () {
            this.select(knex.raw("*,code || ' ' || title as display"))
                .from('generalLedgerAccounts').as('baseGeneralLedgerAccounts');
        }).as('baseGeneralLedgerAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let generalLedgerAccount = await(this.knex.table('generalLedgerAccounts').where('id', id).first());
        return view(generalLedgerAccount);
    }
};