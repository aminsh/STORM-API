"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.cheque');

module.exports = class ChequeQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getById = async(this.getById);
    }

    getChequesByCategory(categoryId, parameters) {
        let query = this.knex.select().from(function () {
            this.select().from('cheques')
                .where('chequeCategoryId', categoryId)
                .orderBy('number')
                .as('baseCheques');
        }).as('baseCheques');

        return kendoQueryResolve(query, parameters, view)
    }

    getById(id) {
        let cheque = await(this.knex.table('cheques').where('id', id).first());
        return view(cheque);
    }

    getWhiteCheques() {
        return this.knex.select(
            'cheques.*',
            'chequeCategories.totalPages',
            'chequeCategories.receivedOn')
            .from('cheques')
            .leftJoin('chequeCategories', 'cheques.chequeCategoryId', 'chequeCategories.id')
            .where('cheques.status', 'White')
            .map(row => ({
                id: row.id,
                number: row.number,
                category: {
                    totalPages: row.totalPages,
                    receivedOn: row.receivedOn
                }
            }));
    }

    getUsedCheques() {
        return this.knex.select('*').from('cheques').andWhere('status', 'Used');
    }
};
