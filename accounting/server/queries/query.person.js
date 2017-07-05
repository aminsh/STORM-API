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

    getById(id, fiscalPeriodId) {
        let knex = this.knex,
            branchId = this.branchId,

            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            detailAccountFields = [
                'id',
                'code',
                'title',
                'address',
                'nationalCode',
                'email',
                'personType',
                'economicCode',
                'registrationNumber',
                'province',
                'city',
                'postalCode'
            ],

            query = knex.select(
                detailAccountFields
                    .concat([
                        knex.raw(`(select count(*) from invoices 
                            where "detailAccountId" = base.id and "invoiceType" = 'sale'
                            limit 1) as "countOfSale"`),
                        knex.raw(`(select date from invoices 
                            where "detailAccountId" = base.id and "invoiceType" = 'sale'
                            order by date desc limit 1) as "lastSaleDate"`),
                        knex.raw(`(select sum(("invoiceLines"."quantity" * "invoiceLines"."unitPrice") - "invoiceLines"."discount" + "invoiceLines"."vat") from invoices
                            left join "invoiceLines" on invoices.id = "invoiceLines"."invoiceId"
                            where "detailAccountId" = base.id and "invoiceType" = 'sale' 
                            and date between '${fiscalPeriod.minDate}' and '${fiscalPeriod.maxDate}'
                            limit 1) as "sumPrice"`),
                        knex.raw(`sum(amount) as "sumPaid"`)
                    ]))
                .from(function () {
                    this.select(
                        'detailAccounts.*',
                        'amount'
                    )
                        .from('invoices')
                        .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                        .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                        .leftJoin('payments', 'payments.invoiceId', 'invoices.id')
                        .where('invoices.branchId', branchId)
                        .andWhere('invoices.invoiceType', 'sale')
                        .andWhereBetween('invoices.date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                        .andWhere('detailAccounts.id', id)
                        .as('base');
                })
                .groupBy(detailAccountFields)
                .first(),

            result = await(query);

        result.sumRemainder = result.sumPrice - result.sumPaid;

        return result;

    }


    getTotalPriceAndCountByMonth(id, fiscalPeriodId) {
        let branchId = this.branchId,
            knex = this.knex,

            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            result = await(knex.select(
                'month',
                knex.raw('count(*) as "count"'),
                knex.raw('sum("price") as "sumPrice"'),
                knex.raw('sum("paid") as "sumPaid"'),
                knex.raw('sum("price" - "paid") as "sumRemainder"')
            )
                .from(function () {
                    this.select(
                        knex.raw('cast(substring("invoices"."date" from 6 for 2) as INTEGER) as "month"'),
                        knex.raw('("invoiceLines"."quantity" * "invoiceLines"."unitPrice") - "invoiceLines"."discount" as "price"'),
                        knex.raw('"payments"."amount" as "paid"')
                    )
                        .from('invoices')
                        .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                        .leftJoin('payments', 'payments.invoiceId', 'invoices.id')
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
                    lastDate: item.lastDate,
                    count: item.count,
                    sumPrice: item.sumPrice,
                    sumPaid: item.sumPaid,
                    sumRemainder: item.sumRemainder
                }));

        return result;
    }
};
