"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    view = require('../viewModel.assemblers/view.invoice'),
    lineView = require('../viewModel.assemblers/view.invoiceLine'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
    SettingsQuery = require('./query.settings'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../../shared/enums');


class InvoiceQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
        this.check = async(this.check);
    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            settings = new SettingsQuery(this.branchId).get(),

            invoice = await(knex
                .select(
                    'invoices.*',
                    knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                    knex.raw('(select coalesce("sum"("amount"),0) from "payments" where "invoiceId" = invoices.id limit 1) as "sumPaidAmount"')
                )
                .from('invoices')
                .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                .where('invoices.id', id)
                .where('invoices.branchId', branchId)
                .first()
            ),

            invoiceLines = await(knex
                .select('invoiceLines.*',
                    knex.raw('CAST("invoiceLines"."unitPrice" AS FLOAT)'),
                    knex.raw('scales.title as scale'),
                    knex.raw('stocks.title as "stockDisplay"'))
                .from('invoiceLines')
                .leftJoin('products', 'invoiceLines.productId', 'products.id')
                .leftJoin('scales', 'products.scaleId', 'scales.id')
                .leftJoin('stocks', 'invoiceLines.stockId', 'stocks.id')
                .where('invoiceLines.branchId', branchId)
                .where('invoiceId', id)
            ),
            sumCharges = (invoice.charges || []).asEnumerable()
                .sum(c => c.value),
            sumChargesVatIncluded = (invoice.charges || []).asEnumerable()
                .where(e => e.vatIncluded)
                .sum(e => e.value),
            invoiceDiscount = invoice.discount || 0;

        let lineHaveVat = invoiceLines.asEnumerable().firstOrDefault(e => e.vat !== 0),
            persistedVat = lineHaveVat
                ? (100 * lineHaveVat.vat / (((lineHaveVat.quantity * lineHaveVat.unitPrice) - lineHaveVat.discount)))
                : 0;

        invoice.sumTotalPrice = invoiceLines.asEnumerable()
                .sum(line => line.quantity * line.unitPrice - line.discount + line.vat)
                - invoiceDiscount +
                sumCharges + (sumChargesVatIncluded * persistedVat / 100);

        invoice.sumRemainder = invoice.sumTotalPrice - (invoice.sumPaidAmount || 0);

        invoice.totalVat = invoiceLines.asEnumerable()
                .sum(line => line.vat) + (sumChargesVatIncluded * persistedVat / 100);

        invoice.chargesVat = sumChargesVatIncluded * persistedVat / 100;

        invoice.invoiceLines = invoiceLines.asEnumerable().select(lineView).toArray();
        invoice.branchId = branchId;

        return view(invoice, settings);
    }

    getAll(parameters, invoiceType) {
        let knex = this.knex,
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
                            .andWhere('invoiceType', invoiceType)
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
        return kendoQueryResolve(query, parameters, view);
    }

    getAllLines(invoiceId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select('*').table(function () {
                this.select('*')
                    .from('invoiceLines')
                    .where('branchId', branchId)
                    .andWhere('invoiceId', invoiceId).as('invoiceLines')
            });

        return kendoQueryResolve(query, parameters, lineView);
    }

    getSummary(fiscalPeriodId, invoiceType) {
        let knex = this.knex,
            branchId = this.branchId,
            fiscalPeriodRepository = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodRepository.getById(fiscalPeriodId));

        return knex.select(
            knex.raw('"count"(*) as "total"'),
            knex.raw('"sum"("totalPrice") as "sumTotalPrice"'),
            knex.raw('"sum"("paidAmount") as "sumPaidAmount"'),
            knex.raw('"sum"("totalPrice"-"paidAmount") as "sumRemainder"')
        ).from(function () {
            this.select('invoices.*',
                knex.raw('(select coalesce("sum"("amount"),0) from "payments" where "invoiceId" = "invoices"."id" limit 1) as "paidAmount"'),
                knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                knex.raw(`(((("invoiceLines"."unitPrice" * "invoiceLines"."quantity") - "invoiceLines"."discount") - coalesce(invoices.discount,0)) 
                                + "invoiceLines"."vat")  as "totalPrice"`))
                .from('invoices')
                .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                .where('invoices.branchId', branchId)
                .andWhere('invoiceType', invoiceType)
                .whereBetween('date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                .as('base');
        }).first();
    }

    getTotalByMonth(fiscalPeriodId, invoiceType) {
        let branchId = this.branchId,
            knex = this.knex,
            fiscalPeriodRepository = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodRepository.getById(fiscalPeriodId));

        return knex.select(
            'month',
            knex.raw('"count"(*) as "total"'),
            knex.raw('"sum"("totalPrice") as "sumTotalPrice"'))
            .from(function () {
                this.select('invoices.*',
                    knex.raw('cast(substring("invoices"."date" from 6 for 2) as INTEGER) as "month"'),
                    knex.raw(`(((("invoiceLines"."unitPrice" * "invoiceLines"."quantity") - "invoiceLines"."discount") - coalesce(invoices.discount,0)) 
                                + "invoiceLines"."vat")  as "totalPrice"`))
                    .from('invoices')
                    .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                    .where('invoices.branchId', branchId)
                    .andWhere('invoiceType', invoiceType)
                    .whereBetween('date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                    .as('base');
            })
            .groupBy('month')
            .orderBy('month')
            .map(item => ({
                total: item.total,
                totalPrice: item.sumTotalPrice,
                month: item.month,
                monthName: enums.getMonth().getDisplay(item.month),
            }));
    }

    getTotalByProduct(fiscalPeriodId, invoiceType) {
        let branchId = this.branchId,
            knex = this.knex,
            fiscalPeriodRepository = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodRepository.getById(fiscalPeriodId));

        return knex.select(
            'productId', 'productTitle', knex.raw('"sum"("quantity") as "total"'))
            .from(function () {
                this.select(
                    'invoiceLines.productId',
                    'invoiceLines.quantity',
                    knex.raw('"products"."title" as "productTitle"'))
                    .from('invoices')
                    .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                    .leftJoin('products', 'invoiceLines.productId', 'products.id')
                    .where('invoices.branchId', branchId)
                    .andWhere('invoiceType', invoiceType)
                    .whereBetween('date', [fiscalPeriod.minDate, fiscalPeriod.maxDate])
                    .as('base');
            })
            .groupBy('productId', 'productTitle')
            .orderByRaw('"count"(*) desc')
            .limit(5)
            .map(item => ({
                productId: item.productId,
                productTitle: item.productTitle,
                total: item.total
            }));
    }

    maxNumber(invoiceType) {
        return this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', invoiceType)
            .max('number')
            .first();
    }

    check(invoiceId) {
        return !!(await(this.knex('invoices').where("id", invoiceId).first()))
    }


}
;

module.exports = InvoiceQuery;