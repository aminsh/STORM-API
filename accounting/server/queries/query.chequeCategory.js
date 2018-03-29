"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.chequeCategory');

class ChequeCategoryQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            let selectExp = knex.raw('"chequeCategories".*, "detailAccounts".code || \' \' || "detailAccounts".title as "bankDisplay"');

            this.select(selectExp)
                .from('chequeCategories')
                .leftJoin('detailAccounts', 'chequeCategories.bankId', 'detailAccounts.id')
                .where('chequeCategories.branchId', branchId)
                .as('base');
        });

        return kendoQueryResolve(query, parameters, view);
    }

    getOpens(detailAccountId) {
        let knex = this.knex;
        let selectExp = ' "id","totalPages", "firstPageNumber", "lastPageNumber", ';
        selectExp += '(SELECT "count"(*) from cheques where "chequeCategoryId" = "baseChequeCategories".id ' +
            'AND "status"=\'White\') as "totalWhiteCheques"';

        return knex.select(knex.raw(selectExp))
            .from(knex.raw('"chequeCategories" as "baseChequeCategories"'))
            .where('branchId', this.branchId)
            .andWhere('isClosed', false)
            .andWhere('detailAccountId', detailAccountId)
            .as("baseChequeCategories");
    }

    getById(id) {
        let category = await(
            this.knex.table('chequeCategories')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());
        return view(category);
    }

    getCheque(bankId){
        let firstOpenCategory = await(
            this.knex.table('chequeCategories')
                .where('branchId', this.branchId)
                .where('isClosed', false)
                .where('bankId', bankId)
                .orderBy('createdAt')
                .first());

        if(!firstOpenCategory)
            return 'NULL';

        let cheque = firstOpenCategory.cheques.asEnumerable()
            .orderBy(item => item.number)
            .first(item => !item.isUsed);

        return cheque.number;
    }
}

module.exports = ChequeCategoryQuery;