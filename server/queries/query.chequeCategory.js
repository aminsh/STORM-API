"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.chequeCategory');

module.exports = class ChequeCategoryQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex;
        let query = knex.select().from(function () {
            let selectExp = '"chequeCategories".*, "detailAccounts".code || \' \' || "detailAccounts".title as "detailAccount","banks".title as "bank"';

            this.select(knex.raw(selectExp)).from('chequeCategories')
                .leftJoin('detailAccounts', 'chequeCategories.detailAccountId', 'detailAccounts.id')
                .leftJoin('banks', 'chequeCategories.bankId', 'banks.id')
                .as('baseChequeCategories');
        });

        return kendoQueryResolve(query, parameters, view);
    }

    getOpens() {
        let knex = this.knex;
        let selectExp = ' "id","totalPages", "firstPageNumber", "lastPageNumber", ';
        selectExp += '(SELECT "count"(*) from cheques where "chequeCategoryId" = "baseChequeCategories".id ' +
            'AND "status"=\'White\') as "totalWhiteCheques"';

        return knex.select(knex.raw(selectExp))
            .from(knex.raw('"chequeCategories" as "baseChequeCategories"'))
            .where('isClosed', false)
            .andWhere('detailAccountId', req.params.detailAccountId)
            .as("baseChequeCategories");
    }

    getById(id) {
        let category = await(this.knex.table('chequeCategories').where('id', id).first());
        return view(category);
    }
};