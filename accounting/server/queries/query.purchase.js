"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    view = require('../viewModel.assemblers/view.purchase'),
    lineView = require('../viewModel.assemblers/view.purchaseLine'),
    kendoQueryResolve = require('../services/kendoQueryResolve');


module.exports = class PurchaseQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().table(function () {
                this.select('*', knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'))
                    .from('purchases')
                    .leftJoin('detailAccounts', 'purchases.detailAccountId', 'detailAccounts.id')
                    .where('purchases.branchId', branchId)
                    .as('base');
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getAllLines(saleId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select('*').table(function () {
                this.select('*', knex.raw('"products"."title" as "productTitle"'))
                    .from('purchaseLines')
                    .leftJoin('products', 'purchaseLines.productId', 'products.id')
                    .where('purchaseLines.branchId', this.branchId)
                    .where('purchaseId', saleId)
            });

        return kendoQueryResolve(query, parameters, lineView);
    }
};