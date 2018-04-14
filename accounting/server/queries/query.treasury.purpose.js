"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    TreasuryPayment = require('./query.treasury.payment'),
    TreasuryReceive = require('./query.treasury.receive'),
    Invoice = require('./query.invoice');

class TreasuryPurposes extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(fiscalPeriodId, parameters) {
    }

    getByInvoiceId(id, treasuryType) {

        let knex = this.knex,
            branchId = this.branchId,
            invoiceQuery = new Invoice(branchId),
            treasuries = [],

            treasuryIds = await(knex.select(
                'treasuryPurpose.treasuryId')
                .from('treasuryPurpose')
                .where('treasuryPurpose.branchId', branchId)
                .where('treasuryPurpose.referenceId', id));

        if (treasuryType === 'receive') {
            let treasuryReceive = new TreasuryReceive(branchId);

            treasuryIds.forEach(item => {
                treasuries.push(treasuryReceive.getById(item))
            });
        }

        if (treasuryType === 'payment') {
            let treasuryPayment = new TreasuryPayment(branchId);

            treasuryIds.forEach(item => {
                treasuries.push(treasuryPayment.getById(item))
            });
        }

        let invoice = invoiceQuery.getById(id);

        invoice.treasuries = treasuries || null;

        return invoice;

    }

}

module.exports = TreasuryPurposes;