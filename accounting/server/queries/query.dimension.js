"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.dimension');

class DimensionQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    getAll(categoryId, parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let query = knex.select().from(function () {
            this.select(knex.raw("*,code || ' ' || title as display"))
                .from('dimensions').as('baseDimensions')
                .where('branchId', branchId)
                .andWhere('dimensionCategoryId', categoryId);
        }).as('baseDimensions');

        return kendoQueryResolve(query, parameters, view)
    }

    getById(id) {
        let dimension = await(
            this.knex.select('*')
                .from('dimensions')
                .where('branchId', this.branchId)
                .andWhere('id', id).first());
        return view(dimension);
    }
}
module.exports = DimensionQuery;