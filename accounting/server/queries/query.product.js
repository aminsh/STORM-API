"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
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

        let branchId = this.branchId,
            knex = this.knex,

            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            totalSalePrice = `select sum(("unitPrice" * "quantity") - discount + vat) from "invoices" 
                left join "invoiceLines" on "invoices".id = "invoiceLines"."invoiceId"
                where "invoices".date between '${fiscalPeriod.minDate}' and '${fiscalPeriod.maxDate}' 
                and "invoices"."branchId" = '${branchId}'
                and "invoiceLines"."productId" = "products".id 
                and "invoiceType" = 'sale'`,
            totalPurchasePrice = `select sum(("unitPrice" * "quantity") - discount + vat) from "invoices" 
                left join "invoiceLines" on "invoices".id = "invoiceLines"."invoiceId"
                where "invoices".date between '${fiscalPeriod.minDate}' and '${fiscalPeriod.maxDate}' 
                and "invoices"."branchId" = '${branchId}'
                and "invoiceLines"."productId" = "products".id 
                and "invoiceType" = 'purchase'`,
            inventory = `select sum(case when "inventoryType" = 'input' then "quantity" else "quantity" * -1 end) as "sumQuantity" 
                from "inventories" left join "inventoryLines" on "inventories".id = "inventoryLines"."inventoryId"
                where "inventories"."fiscalPeriodId" = '${fiscalPeriod.id}'
                and "inventories"."branchId" = '${branchId}'
                and "productId" = "products".id`,
            costOfGood = `select sum("quantity" * "unitPrice") / sum("quantity") as "sumQuantity" from "inventories" 
                left join "inventoryLines" on "inventories".id = "inventoryLines"."inventoryId"
                where "inventories"."fiscalPeriodId" = '${fiscalPeriod.id}'
                and "inventories"."branchId" = '${branchId}'
                and "productId" = "products".id
                and "inventoryType" = 'input'`,

            result = await(this.knex.select(
                '*',
                knex.raw(`coalesce((${totalSalePrice}),0) as "sumTotalSalePrice"`),
                knex.raw(`coalesce((${totalPurchasePrice}),0) as "sumTotalPurchasePrice"`),
                knex.raw(`coalesce((${inventory}),0) as "sumQuantity"`),
                knex.raw(`coalesce((${costOfGood}),0) as "costOfGood"`)
            )
                .from('products')
                .where('id', id)
                .first());

        return view(result);
    }
};
