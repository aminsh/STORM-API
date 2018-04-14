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

    getTreasuryAmountById(id) {
        let knex = this.knex,
            branchId = this.branchId;

        return await(knex.select(
            'treasury.id',
            'treasury.amount'
            )
                .from('treasury')
                .where('treasury.branchId', branchId)
                .where('treasury.id', id)
                .first()
        )
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

    getTreasuriesTotalAmount(invoiceId) {
        let knex = this.knex,
            branchId = this.branchId,
            treasuriesAmount = [],

            treasuryIds = await(knex.select(
                'treasuryPurpose.treasuryId')
                .from('treasuryPurpose')
                .where('treasuryPurpose.branchId', branchId)
                .where('treasuryPurpose.referenceId', invoiceId));

        treasuryIds.forEach(item => {
            treasuriesAmount.push(this.getTreasuryAmountById(item));
        });

        return treasuriesAmount.length > 0 ? treasuriesAmount.asEnumerable().sum(item => item.amount) : 0 ;
    }

}

module.exports = TreasuryPurposes;