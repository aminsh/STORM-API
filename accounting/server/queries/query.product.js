"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.product');

module.exports = class ProductQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.getById = async(this.getById);
    }

    remove(id) {
        return this.knex('products').where('id', id).del();
    }

    getAll(parameters) {
        let query = this.knex.select()
            .from('products')
            .where('branchId', this.branchId);
        return kendoQueryResolve(query, parameters, view);
    }

    getById(id, fiscalPeriodId) {

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


        let knex = this.knex,
            inventorySelect = `select
             "sum"((case
             when "inventories"."inventoryType" = 'input' then 1
             when "inventories"."inventoryType" = 'output' then -1
             end) *  "inventoryLines"."quantity") as "total"
             from "inventories"
             left join "inventoryLines" on "inventories"."id" = "inventoryLines"."inventoryId"
             where "inventories"."fiscalPeriodId"= '${fiscalPeriodId}' and "inventoryLines"."productId" = '${id}'`;

        let entity = await(this.knex.select(
            'products.*', knex.raw(`(${inventorySelect}) as "totalQuantity"`))
            .from('products')
            .where('branchId', this.branchId)
            .andWhere('id', id)
            .first());

        return view(entity);
    }
};