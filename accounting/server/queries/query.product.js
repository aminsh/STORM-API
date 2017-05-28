"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.product');

module.exports = class ProductQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(parameters){
        let query = this.knex.select()
            .from('products')
            .where('branchId', this.branchId);
        return kendoQueryResolve(query, parameters, view);
    }
};