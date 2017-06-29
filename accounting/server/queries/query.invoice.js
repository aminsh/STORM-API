"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    view = require('../viewModel.assemblers/view.invoice'),
    lineView = require('../viewModel.assemblers/view.invoiceLine'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../shared/enums');


module.exports = class InvoiceQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            invoice = await(knex.select().table(function () {
                this.select(
                    'id',
                    'number',
                    'date',
                    'detailAccountId',
                    'detailAccountDisplay',
                    'invoiceStatus',
                    'description',
                    knex.raw('"sum"("totalPrice") as "sumTotalPrice"'),
                    knex.raw('"sum"("paidAmount") as "sumPaidAmount"'),
                    knex.raw('"sum"("totalPrice"-"paidAmount") as "sumRemainder"'))
                    .from(function () {
                        this.select('invoices.*',
                            knex.raw('(select coalesce("sum"("amount"),0) from "payments" where "invoiceId" = "invoices"."id" limit 1) as "paidAmount"'),
                            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                            knex.raw('(("invoiceLines"."unitPrice" * "invoiceLines"."quantity") - "invoiceLines"."discount" + "invoiceLines"."vat") as "totalPrice"'))
                            .from('invoices')
                            .leftJoin('invoiceLines', 'invoices.id', 'invoiceLines.invoiceId')
                            .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                            .where('invoices.branchId', branchId)
                            .andWhere('invoiceId', id)
                            .as('base');
                    }).as("group")
                    .groupBy(
                        'id',
                        'number',
                        'date',
                        'detailAccountId',
                        'detailAccountDisplay',
                        'invoiceStatus',
                        'description')
                    .orderBy('number', 'desc')

            }).first()), invoiceLines = await(knex.select('*')
                .from('invoiceLines')
                .where('branchId', branchId)
                .andWhere('invoiceId', id));


        //
        //  invoice = await(knex.select('invoices.*',
        //     knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'))
        //     .from('invoices')
        //     .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
        //     .where('invoices.branchId', branchId)
        //     .andWhere('invoices.id', id)
        //     .first()),
        // invoiceLines = await(knex.select('*')
        //     .from('invoiceLines')
        //     .where('branchId', branchId)
        //     .andWhere('invoiceId', id));

        invoice.invoiceLines = invoiceLines.asEnumerable().select(lineView).toArray();

        return view(invoice);
    }

    getAll(parameters, invoiceType) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().table(function () {
                this.select(
                    'id',
                    'number',
                    'date',
                    'detailAccountId',
                    'detailAccountDisplay',
                    'invoiceStatus',
                    'description',
                    knex.raw('"sum"("totalPrice") as "sumTotalPrice"'),
                    knex.raw('"sum"("paidAmount") as "sumPaidAmount"'),
                    knex.raw('"sum"("totalPrice"-"paidAmount") as "sumRemainder"'))
                    .from(function () {
                        this.select('invoices.*',
                            knex.raw('(select coalesce("sum"("amount"),0) from "payments" where "invoiceId" = "invoices"."id" limit 1) as "paidAmount"'),
                            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                            knex.raw('(("invoiceLines"."unitPrice" * "invoiceLines"."quantity") - "invoiceLines"."discount" + "invoiceLines"."vat") as "totalPrice"'))
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
                        'description')
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
                knex.raw('(("invoiceLines"."unitPrice" * "invoiceLines"."quantity") - "invoiceLines"."discount" + "invoiceLines"."vat") as "totalPrice"'))
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
                    knex.raw('(("invoiceLines"."unitPrice" * "invoiceLines"."quantity") - "invoiceLines"."discount" + "invoiceLines"."vat") as "totalPrice"'))
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
            'productId', 'productTitle', knex.raw('"count"(*) as "total"'))
            .from(function () {
                this.select('invoiceLines.productId', knex.raw('"products"."title" as "productTitle"'))
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
};