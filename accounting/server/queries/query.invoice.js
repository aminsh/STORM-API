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

    getAll(parameters, invoiceType) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select().table(function () {
                this.select('*', knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'))
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
};