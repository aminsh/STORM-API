"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../../shared/enums'),
    view = require('../viewModel.assemblers/view.person');

class PersonQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getById(id, fiscalPeriodId) {
        let knex = this.knex,
            branchId = this.branchId,

            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            entity = await(knex.select(
                '*',
                knex.raw(`(select count(*) from invoices 
                            where "detailAccountId" = "detailAccounts".id and "invoiceType" = 'sale'
                            limit 1) as "countOfSale"`),

                knex.raw(`(select date from invoices 
                            where "detailAccountId" = "detailAccounts".id and "invoiceType" = 'sale'
                            order by date desc limit 1) as "lastSaleDate"`),

                knex.raw(`(select sum(("invoiceLines"."quantity" * "invoiceLines"."unitPrice") - "invoiceLines"."discount" + "invoiceLines"."vat") from invoices
                            left join "invoiceLines" on invoices.id = "invoiceLines"."invoiceId"
                            where "detailAccountId" = "detailAccounts".id and "invoiceType" = 'sale' 
                            and date between '${fiscalPeriod.minDate}' and '${fiscalPeriod.maxDate}'
                            limit 1) as "sumSaleAmount"`),

                knex.raw(`(select sum(case when debtor > 0 then debtor else 0 * -1 end) as "sumDebtor"
                                    from journals
                                    left join "journalLines" on journals.id = "journalLines"."journalId"
                                    left join "subsidiaryLedgerAccounts" 
                                    on "journalLines"."subsidiaryLedgerAccountId" = "subsidiaryLedgerAccounts"."id"
                                    where "journalLines"."detailAccountId" = "detailAccounts"."id" 
                                    and "periodId" = '${fiscalPeriodId}'
                                    and "subsidiaryLedgerAccounts".code in('1104', '2101')) as "sumDebtor"`),

                knex.raw(`(select sum(case when creditor > 0 then creditor else 0 * -1 end) as "sumCreditor"
                                    from journals
                                    left join "journalLines" on journals.id = "journalLines"."journalId"
                                    left join "subsidiaryLedgerAccounts" 
                                    on "journalLines"."subsidiaryLedgerAccountId" = "subsidiaryLedgerAccounts"."id"
                                    where "journalLines"."detailAccountId" = "detailAccounts"."id" 
                                    and "periodId" = '${fiscalPeriodId}'
                                    and "subsidiaryLedgerAccounts".code in('1104', '2101')) as "sumCreditor"`)
            )
                .from('detailAccounts')
                .where('branchId', branchId)
                .where('id', id)
                .first());

        return view(entity);

    }

    getManyByIds(ids){
        let products = await(this.knex.select('*').from('detailAccounts').whereIn('id', ids));
        return products.asEnumerable()
            .select(view)
            .toArray();
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

module.exports = PersonQuery;
