"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.product');

module.exports = class ProductCategoryQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(parameters) {
        let query = this.knex.select()
            .from('productCategories')
            .where('branchId', this.branchId);
        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        return this.knex.select()
            .from('productCategories')
            .where('branchId', this.branchId)
            .andWhere('id', id)
            .first();
    }
};