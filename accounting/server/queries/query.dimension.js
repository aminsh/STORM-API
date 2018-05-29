"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.dimension');

class DimensionQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
        this.getById = async(this.getById);
    }

    getAll(categoryId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().from(function () {
                this.select(knex.raw("*,code || ' ' || title as display"))
                    .from('dimensions').as('baseDimensions')
                    .where('branchId', branchId)
                    .andWhere('dimensionCategoryId', categoryId);
            }).as('baseDimensions');

        return kendoQueryResolve(query, parameters, view)
    }

    getById(id) {
        let branchId = this.branchId,

            dimension = this.await(
                this.knex.select('*')
                    .from('dimensions')
                    .where('branchId', branchId)
                    .andWhere('id', id).first());
        return dimension ? view(dimension) : [];
    }
}

module.exports = DimensionQuery;