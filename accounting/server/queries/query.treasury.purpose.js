"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.treasury');

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

    getByInvoiceId(id, parameters) {

        let knex = this.knex,
            branchId = this.branchId,

            treasuryIds = await(knex.select(
                'treasuryPurpose.treasuryId')
                .from('treasuryPurpose')
                .where('treasuryPurpose.branchId', branchId)
                .where('treasuryPurpose.referenceId', id)),


            treasuries = knex.from(function () {
                this.select(
                    'treasury.id',
                    'treasury.imageUrl',
                    'treasury.documentType',
                    'treasury.amount',
                    'treasury.transferDate',
                    'treasury.sourceDetailAccountId',
                    knex.raw(`treasury."sourceDetailAccountId" as "payerId"`),
                    knex.raw(`treasury."destinationDetailAccountId" as "receiverId"`),
                    knex.raw(`source.title as "sourceTitle"`),
                    'treasury.destinationDetailAccountId',
                    knex.raw(`destination.title as "destinationTitle"`),
                    'treasuryDocumentDetails.status',
                    'treasuryDocumentDetails.number'
                )
                    .from('treasury')
                    .leftJoin('detailAccounts as source', 'source.id', 'treasury.sourceDetailAccountId')
                    .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                    .leftJoin('treasuryDocumentDetails', 'treasuryDocumentDetails.id', 'treasury.documentDetailId')
                    .where('treasury.branchId', branchId)
                    .whereIn('treasury.id', treasuryIds.map(item => item.treasuryId))
                    .as('base')
            });

        return kendoQueryResolve(treasuries, parameters, view)
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
            treasuriesAmount.push(this.getTreasuryAmountById(item.treasuryId));
        });

        return treasuriesAmount.length > 0 ? treasuriesAmount.asEnumerable().sum(item => item.amount) : 0;
    }

}

module.exports = TreasuryPurposes;