"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve');

module.exports = class DetailAccountCategoryQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getById(id) {
        let knex = this.knex,
            category = await(knex.select('*')
                .from('detailAccountCategories')
                .where('branchId', this.branchId)
                .where('id', id)
                .first()),

            subsidiaryLedgerAccountIds = category.subsidiaryLedgerAccountIds.split('|'),
            subsidiaryLedgerAccounts = await(knex
                .select(
                    'id',
                    knex.raw(`"subsidiaryLedgerAccounts".code || ' ' || "subsidiaryLedgerAccounts".title as "display"`))
                .from('subsidiaryLedgerAccounts')
                .where('branchId', this.branchId)
                .whereIn('id',subsidiaryLedgerAccountIds)
            );

        return {
            id: category.id,
            title: category.title,
            subsidiaryLedgerAccounts
        };
    }

    getAll(parameters) {
        let query = this.knex
                .from('detailAccountCategories')
                .where('branchId', this.branchId),

            view = item => ({
                id: item.id,
                title: item.title
            });

        return kendoQueryResolve(query, parameters, view);
    }
};
