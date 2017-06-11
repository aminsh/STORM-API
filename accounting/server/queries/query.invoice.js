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
                .first());

        return view(invoice);
    }

    getAll(parameters, invoiceType) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().table(function () {
                this.select('invoices.*', knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'))
                    .from('invoices')
                    .leftJoin('detailAccounts', 'invoices.detailAccountId', 'detailAccounts.id')
                    .where('invoices.branchId', branchId)
                    .andWhere('invoiceType', invoiceType)
                    .as('base');
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getAllLines(invoiceId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select('*').table(function () {
                this.select('*')
                    .from('invoiceLines')
                    .where('branchId', this.branchId)
                    .andWhere('invoiceId', invoiceId)
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