"use strict";


const BaseQuery = require('../queries/query.base'),
    translate = require('../services/translateService'),
    enums = require('../../../shared/enums'),
    filterQueryConfig = require('./report.filter.config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class InvoiceTurnover extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);

        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode;
        this.filter = filter;
        this.filterConfig = new filterQueryConfig(branchId, currentFiscalPeriodId, mode, filter);
        this.options = await(this.filterConfig.getDateOptions());
    }

    getAll() {
        let knex = this.knex,
            option = this.options,
            minNumber = option.filter.minNumber || option.filter.maxNumber,
            maxNumber = option.filter.maxNumber || option.filter.minNumber,
            branchId = this.branchId,
            baseQuery = `select coalesce(sum(value),0) from invoices as i left join json_to_recordset(i.charges) as x(key text, value int, "vatIncluded" boolean) on true where i.id = "base".id`,
            sumChargesQuery = `(${baseQuery}) + ((${baseQuery} and "vatIncluded" = true) *  
            coalesce((select (100 * line.vat) / ((line.quantity * line."unitPrice") - line.discount) from "invoiceLines" as line where "invoiceId" = "base".id and vat <> 0 limit 1), 0) /100)`,

            query = knex.select().table(function () {
                this.select(
                    'id',
                    'number',
                    'date',
                    'detailAccountId',
                    'detailAccountDisplay',
                    'invoiceStatus',
                    'description',
                    'title',
                    'journalId',
                    knex.raw(`sum(discount) as discount`),
                    knex.raw(`"sum"("totalPrice") + ${sumChargesQuery} - sum(DISTINCT coalesce(discount,0)) as "sumTotalPrice" `),
                    knex.raw('(select coalesce("sum"("amount"),0) from "payments" where "invoiceId" = "base"."id" limit 1) as "sumPaidAmount"'),
                    knex.raw(`("sum"("totalPrice") + ${sumChargesQuery}) - sum(DISTINCT coalesce(discount,0)) -(select coalesce("sum"("amount"),0) from "payments" where "invoiceId" = "base"."id" limit 1) as "sumRemainder"`))
                    .from(function () {
                        this.select('invoices.*',
                            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                            knex.raw(`("invoiceLines"."unitPrice" * "invoiceLines".quantity - "invoiceLines".discount + "invoiceLines".vat) as "totalPrice"`))
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                            .where('invoices.branchId', branchId)
                            .where('invoiceType','sale')
                            .whereBetween('invoices.date', [option.fromMainDate, option.toDate])
                            .as('base');
                    }).as("group")
                    .groupBy(
                        'id',
                        'number',
                        'date',
                        'detailAccountId',
                        'detailAccountDisplay',
                        'invoiceStatus',
                        'description',
                        'title',
                        'journalId')
                    .orderBy('number', 'desc')

            });

        if (minNumber || maxNumber)
            query.andWhereBetween('number', [minNumber, maxNumber]);

        return await(query);
    }

    peopleSaleInvoiceTurnover(){
        let knex = this.knex,
            branchId = this.branchId,
            baseQuery = `select coalesce(sum(value),0) from invoices as i left join json_to_recordset(i.charges) as x(key text, value int, "vatIncluded" boolean) on true where i.id = "base"."invoiceId"`,
            sumChargesQuery = `(${baseQuery}) + ((${baseQuery} and "vatIncluded" = true) *  
            coalesce((select (100 * line.vat) / ((line.quantity * line."unitPrice") - line.discount) from "invoiceLines" as line where "invoiceId" = "base"."invoiceId" and vat <> 0 limit 1), 0) /100)`,

            query = await(
                knex.select().table(function () {
                    this.select(knex.raw(`
                         id, title, 
                         sum("invoiceCount") as "invoiceCount",
                         sum("sumQuantity") as "sumQuantity",
                         sum("sumPrice") as "sumPrice",
                         sum("sumInvoiceLinesDiscount") as "sumInvoiceLinesDiscount",
                         sum("sumVat") as "sumVat",
                         sum("invoiceDiscount") as "invoiceDiscount", 
                         sum("paymentAmount") as "paymentAmount", 
                         sum("totalAmount" + ${sumChargesQuery}) as "totalAmount",
                         sum(remainder + ${sumChargesQuery}) as remainder
                    `))
                        .from(function () {
                            this.select(knex.raw(` invoices."id" as "invoiceId",
                                "detailAccounts"."id", "detailAccounts".title, 
                                 COUNT(DISTINCT invoices."id") as "invoiceCount",
                                 SUM("invoiceLines".quantity) as "sumQuantity", SUM("invoiceLines"."unitPrice") as "sumPrice",
                                 SUM("invoiceLines".discount) as "sumInvoiceLinesDiscount", SUM("invoiceLines".vat) as "sumVat",
                                 SUM(COALESCE(invoices.discount,0)) as "invoiceDiscount", 
                                 SUM(COALESCE(payments.amount,0)) as "paymentAmount", 
                                 SUM(("invoiceLines".quantity * "invoiceLines"."unitPrice" -"invoiceLines".discount + "invoiceLines".vat)
                                        - COALESCE(invoices.discount,0)) as "totalAmount",
                                 SUM(("invoiceLines".quantity * "invoiceLines"."unitPrice" -"invoiceLines".discount + "invoiceLines".vat)
                                        - COALESCE(invoices.discount,0))
                                    - SUM(COALESCE(payments.amount,0)) as remainder
                            `))
                            .from('invoices')
                            .leftJoin('invoiceLines','invoices.id','invoiceLines.invoiceId')
                            .leftJoin('detailAccounts','detailAccounts.id','invoices.detailAccountId')
                            .leftJoin('payments','payments.invoiceId','invoices.id')
                            .where('invoices.branchId',branchId)
                            .where('invoices.invoiceType','sale')
                            .as('base')
                            .groupBy('detailAccounts.id','detailAccounts.title','invoices.id')
                        })
                        .as('result')
                        .groupBy('id','title')
                     })
                 );

/*            query = await(knex.select(knex.raw(`
                "detailAccounts"."id", "detailAccounts".title, 
                 COUNT(DISTINCT invoices."id") as "invoiceCount",
                 SUM("invoiceLines".quantity) as "sumQuantity", SUM("invoiceLines"."unitPrice") as "sumPrice",
                 SUM("invoiceLines".discount) as "sumInvoiceLinesDiscount", SUM("invoiceLines".vat) as "sumVat",
                 SUM(COALESCE(invoices.discount,0)) as "invoiceDiscount", 
                 SUM(COALESCE(payments.amount,0)) as "paymentAmount", 
                 SUM(("invoiceLines".quantity * "invoiceLines"."unitPrice" -"invoiceLines".discount + "invoiceLines".vat)
                        - COALESCE(invoices.discount,0)) + ${sumChargesQuery} as "totalAmount",
                 SUM(("invoiceLines".quantity * "invoiceLines"."unitPrice" -"invoiceLines".discount + "invoiceLines".vat)
                        - COALESCE(invoices.discount,0)) + ${sumChargesQuery}
                        - SUM(COALESCE(payments.amount,0)) as remainder
            `))
                .from('invoices')
                .leftJoin('invoiceLines','invoices.id','invoiceLines.invoiceId')
                .leftJoin('detailAccounts','detailAccounts.id','invoices.detailAccountId')
                .leftJoin('payments','payments.invoiceId','invoices.id')
                .where('invoices.branchId',branchId)
                .where('invoices.invoiceType','sale')
                .groupBy('detailAccounts.id','detailAccounts.title')
                );*/

/*        let lineHaveVat = query.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? (100 * lineHaveVat.vat / (((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)))
                : 0;

        query.forEach(item => {
            item.charges = (item.charges || []).asEnumerable()
                .select(c => ({
                    key: c.key,
                    sumVat: (item.charges || []).asEnumerable()
                        .sum(c => c.vatIncluded ? c.value * persistedVat / 100 : 0),
                    sumValue: (item.charges || []).asEnumerable()
                        .sum(e => e.value)
                }))
                .toArray();
        });*/


       return query;
    }

}

module.exports = InvoiceTurnover;
