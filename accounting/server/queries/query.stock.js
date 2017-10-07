"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = item => ({
        id: item.id,
        title: item.title,
        address: item.address
    });

class StockQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    remove(id) {
        return this.knex('products').where('id', id).del();
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            query = knex.select()
                .from(function () {
                    this.select('*')
                        .from('stocks')
                        .where('branchId', branchId)
                        .as('base');
                });
        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {

        let entity = await(this.knex.select('id', 'title')
            .from('stocks')
            .where('branchId', this.branchId)
            .where('id', id)
            .first());

        return view(entity);
    }
}

module.exports = StockQuery;
