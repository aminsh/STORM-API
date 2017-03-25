"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.dimensionCategory');

module.exports = class DimensionCategoryQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(parameters) {
        let query = this.knex.select().from('dimensionCategories');
        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let category = await(this.knex.table('dimensionCategories').where('id', id).first());
        return view(category);
    }
};