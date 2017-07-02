"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../shared/enums');

module.exports = class PersonQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    remove(id) {
        return this.knex('products').where('id', id).del();
    }

    getTotalPriceAndCountByMonth(id, fiscalPeriodId) {
        let branchId = this.branchId,
            knex = this.knex,

            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            result = await(knex.select(
                'month',
                knex.raw('count(*) as "count"'),
                knex.raw('sum("price") as "sumPrice"')
            )
                .from(function () {
                    this.select(
                        knex.raw('cast(substring("invoices"."date" from 6 for 2) as INTEGER) as "month"'),
                        knex.raw('("invoiceLines"."quantity" * "invoiceLines"."unitPrice") - "invoiceLines"."discount" as "price"')
                    )
                        .from('invoices')
                        .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                        .where('invoices.branchId', branchId)
                        .andWhere('invoices.detailAccountId', id)
                        .andWhere('invoices.invoiceType', 'sale')
                        .andWhereBetween('invoices.date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                        .as('base');
                })
                .groupBy('month')
                .orderBy('month'))
                .map(item => ({
                    month: item.month,
                    monthDisplay: enums.getMonth().getDisplay(item.month),
                    count: item.count,
                    sumPrice: item.sumPrice
                }));

        return result;
    }
};
