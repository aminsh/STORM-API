"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    view = require('../viewModel.assemblers/view.sale'),
    lineView = require('../viewModel.assemblers/view.saleLine'),
    kendoQueryResolve = require('../services/kendoQueryResolve');


module.exports = class SaleQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().table(function () {
                this.select('*', knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'))
                    .from('sales')
                    .leftJoin('detailAccounts', 'sales.detailAccountId', 'detailAccounts.id')
                    .where('sales.branchId', branchId)
                    .as('base');
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getAllLines(saleId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select('*').table(function () {
                this.select('*', knex.raw('"products"."title" as "productTitle"'))
                    .from('saleLines')
                    .leftJoin('products', 'saleLines.productId', 'products.id')
                    .where('saleLines.branchId', this.branchId)
                    .where('saleId', saleId)
            });

        return kendoQueryResolve(query, parameters, lineView);
    }
};