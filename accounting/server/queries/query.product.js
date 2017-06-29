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

    getAll(parameters) {
        let query = this.knex.select()
            .from('products')
            .where('branchId', this.branchId);
        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
/*
        select products.*, (il."unitPrice"*il.quantity)-il.discount as "netPrice", il.quantity, il.discount, il."unitPrice"
        0 as inventory, 0 as "cost", 0 as profit
        from products
        left Join (select "invoiceLines"."productId",
            sum("invoiceLines"."unitPrice") as "unitPrice",
            sum("invoiceLines"."quantity") as "quantity",
            sum("invoiceLines"."discount") as discount
        from "invoiceLines"
        left Join invoices on invoices.id="invoiceLines"."invoiceId"
        group by "invoiceLines"."productId")as il on il."productId" = products.id

        LEFT JOIN inventory*/

        let query = this.knex.select()
            .from('products')
            .leftJoin('invoiceLines','products.id','invoiceLines.productId')
            .leftJoin('invoices','invoices.id','invoiceLines.invoiceId')
            .where('branchId', this.branchId)
            .andWhere('id', id)
            .first();
        return query;
    }
};