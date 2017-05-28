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
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw("*,code || ' ' || title as display"))
                .from('generalLedgerAccounts')
                .where('branchId', branchId)
                .as('baseGeneralLedgerAccounts');
        }).as('baseGeneralLedgerAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let generalLedgerAccount = await(
            this.knex.table('generalLedgerAccounts')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());
        return view(generalLedgerAccount);
    }
};