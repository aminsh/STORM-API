"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.subsidiaryLedgerAccount');

module.exports = class SubsidiaryLedgerAccountQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex;
        let query = knex.select().from(function () {
            this.select(
                knex.raw('"subsidiaryLedgerAccounts".*'),
                knex.raw('"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display"'),
                knex.raw('"generalLedgerAccounts".code || \' \' || "generalLedgerAccounts".title as "generalLedgerAccountDisplay"'),
                knex.raw('"generalLedgerAccounts".code || \'-\' || "subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "account"')
            )
                .from('subsidiaryLedgerAccounts')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .as('baseSubsidiaryLedgerAccounts');
        }).as('baseSubsidiaryLedgerAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getAllByGeneralLedgerAccount(generalLedgerAccountId, parameters) {
        let knex = this.knex;
        let query = knex.select().from(function () {
            let selectExp = '"subsidiaryLedgerAccounts".*,' +
                '"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display"';

            this.select(knex.raw(selectExp))
                .from('subsidiaryLedgerAccounts')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .where('generalLedgerAccountId', generalLedgerAccountId)
                .as('baseSubsidiaryLedgerAccounts');
        }).as('baseSubsidiaryLedgerAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let subsidiaryLedgerAccount = await(this.knex.table('subsidiaryLedgerAccounts').where('id', id).first());
        return view(subsidiaryLedgerAccount);
    }
};