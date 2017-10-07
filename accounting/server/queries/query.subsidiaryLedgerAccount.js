"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.subsidiaryLedgerAccount');

class SubsidiaryLedgerAccountQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;
        let query = knex.select().from(function () {
            this.select(
                knex.raw('"subsidiaryLedgerAccounts".*'),
                knex.raw('"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display"'),
                knex.raw('"generalLedgerAccounts".code || \' \' || "generalLedgerAccounts".title as "generalLedgerAccountDisplay"'),
                knex.raw('"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "account"')
            )
                .from('subsidiaryLedgerAccounts')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .where('subsidiaryLedgerAccounts.branchId', branchId)
                .as('baseSubsidiaryLedgerAccounts');
        }).as('baseSubsidiaryLedgerAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getAccountById(id){
        let knex = this.knex,
            branchId = this.branchId;
        let firstSubsidiaryLedgerAccount = await(knex.select().from(function () {
            this.select(
                knex.raw('"subsidiaryLedgerAccounts".*'),
                knex.raw('"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display"'),
                knex.raw('"generalLedgerAccounts".code || \' \' || "generalLedgerAccounts".title as "generalLedgerAccountDisplay"'),
                knex.raw('"generalLedgerAccounts".code || \'-\' || "subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "account"')
            )
                .from('subsidiaryLedgerAccounts')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .andWhere('subsidiaryLedgerAccounts.id', id)
                .as('baseSubsidiaryLedgerAccounts');
        }).first());

        return view(firstSubsidiaryLedgerAccount);
    }

    getAllByGeneralLedgerAccount(generalLedgerAccountId, parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            let selectExp = '"subsidiaryLedgerAccounts".*,' +
                '"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "display"';

            this.select(knex.raw(selectExp))
                .from('subsidiaryLedgerAccounts')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .where('subsidiaryLedgerAccounts.branchId', branchId)
                .where('generalLedgerAccountId', generalLedgerAccountId)
                .as('baseSubsidiaryLedgerAccounts');
        }).as('baseSubsidiaryLedgerAccounts');

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let subsidiaryLedgerAccount = await(
            this.knex.table('subsidiaryLedgerAccounts')
                .where('branchId', this.branchId)
                .where('id', id).first());
        return view(subsidiaryLedgerAccount);
    }

    getAllIcome(parameters){
        let knex = this.knex,
            subquery = knex.select('id').from('generalLedgerAccounts')
                .where('groupingType', '7'),

            query = knex.from('subsidiaryLedgerAccounts')
                .where('branchId', this.branchId)
                .whereIn('generalLedgerAccountId', subquery);

        return kendoQueryResolve(query, parameters, view);
    }

    getAllExpense(parameters){
        let knex = this.knex,
            subquery = knex.select('id').from('generalLedgerAccounts')
                .where('groupingType', '8'),

            query = knex.from('subsidiaryLedgerAccounts')
                .where('branchId', this.branchId)
                .whereIn('generalLedgerAccountId', subquery);

        return kendoQueryResolve(query, parameters, view);
    }
};

module.exports = SubsidiaryLedgerAccountQuery;