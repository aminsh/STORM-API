"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    view = require('../viewModel.assemblers/view.invoice'),
    lineView = require('../viewModel.assemblers/view.invoiceLine'),
    kendoQueryResolve = require('../services/kendoQueryResolve');


module.exports = class InvoiceQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            invoice = await(knex.select('invoices.*',
                knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'))
                .from('invoices')
                .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                .where('invoices.branchId', branchId)
                .andWhere('invoices.id', id)
                .first()),
            invoiceLines = await(knex.select('*')
                .from('invoiceLines')
                .where('branchId', branchId)
                .andWhere('invoiceId', id));

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
                            knex.raw('(select "sum"("amount") from "payments" where "invoiceId" = "invoices"."id" limit 1) as "paidAmount"'),
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

    maxNumber(invoiceType) {
        return this.knex.table('invoices')
            .modify(this.modify, this.branchId)
            .where('invoiceType', invoiceType)
            .max('number')
            .first();
    }
};