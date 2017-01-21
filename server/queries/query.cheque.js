"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.cheque');

module.exports = class ChequeQuery extends BaseQuery {
    constructor(knex) {
        super(knex);

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

    getWhiteCheques(categoryId) {
        let query = this.knex.select('*').from('cheques').where('chequeCategoryId', categoryId).andWhere('status', 'White');
        return kendoQueryResolve(query, req.query, view);
    }

    getUsedCheques(paramters) {
        let query = this.knex.select('*').from('cheques').andWhere('status', 'Used');
        return kendoQueryResolve(query, paramters, view);
    }
};
