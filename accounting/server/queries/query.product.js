"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../shared/enums'),
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
        let knex = this.knex,
            branchId = this.branchId,
            query = this.knex.select()
            .from(function () {
                this.select('products.*', knex.raw('scales.title as "scaleDisplay"'))
                    .from('products')
                    .leftJoin('scales', 'products.scaleId', 'scales.id')
                    .where('products.branchId', branchId)
                    .as('base');
            });
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
            totalSaleDiscount = `select sum("discount") from "invoices" 
                left join "invoiceLines" on "invoices".id = "invoiceLines"."invoiceId"
                where "invoices".date between '${fiscalPeriod.minDate}' and '${fiscalPeriod.maxDate}' 
                and "invoices"."branchId" = '${branchId}'
                and "invoiceLines"."productId" = "products".id 
                and "invoiceType" = 'purchase'`,
            countOfSale = `select count(*) from "invoices" 
                left join "invoiceLines" on "invoices".id = "invoiceLines"."invoiceId"
                where "invoices".date between '${fiscalPeriod.minDate}' and '${fiscalPeriod.maxDate}' 
                and "invoices"."branchId" = '${branchId}'
                and "invoiceLines"."productId" = "products".id 
                and "invoiceType" = 'sale'
                group by "invoices"."id" 
                limit 1`,
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
                'products.*',
                knex.raw('scales.title as "scaleDisplay"'),
                knex.raw(`coalesce((${totalSalePrice}),0) as "sumSalePrice"`),
                knex.raw(`coalesce((${totalSaleDiscount}),0) as "sumDiscount"`),
                knex.raw(`coalesce((${countOfSale}),0) as "countOnSale"`),
                knex.raw(`coalesce((${inventory}),0) as "sumQuantity"`),
                knex.raw(`coalesce((${costOfGood}),0) as "costOfGood"`)
            )
                .from('products')
                .leftJoin('scales', 'products.scaleId', 'scales.id')
                .where('products.branchId', branchId)
                .andWhere('products.id', id)
                .first());

        return view(result);
    }

    getTotalPriceAndCountByMonth(id, fiscalPeriodId) {
        let branchId = this.branchId,
            knex = this.knex,

            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            result = await(knex.select(
                'month',
                knex.raw('sum("quantity") as "sumQuantity"'),
                knex.raw('sum("price") as "sumPrice"')
            )
                .from(function () {
                    this.select(
                        knex.raw('cast(substring("invoices"."date" from 6 for 2) as INTEGER) as "month"'),
                        knex.raw('"invoiceLines"."quantity"'),
                        knex.raw('("invoiceLines"."quantity" * "invoiceLines"."unitPrice") - "invoiceLines"."discount" as "price"')
                    )
                        .from('invoices')
                        .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                        .where('invoices.branchId', branchId)
                        .andWhere('invoiceLines.productId', id)
                        .andWhere('invoices.invoiceType', 'sale')
                        .andWhereBetween('invoices.date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                        .as('base');
                })
                .groupBy('month')
                .orderBy('month'))
                .map(item => ({
                    month: item.month,
                    monthDisplay: enums.getMonth().getDisplay(item.month),
                    sumQuantity: item.sumQuantity,
                    sumPrice: item.sumPrice
                }));

        return result;
    }
};
