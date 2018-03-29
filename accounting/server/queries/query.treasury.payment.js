"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('./query.fiscalPeriod'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.treasury'),
    cashView = require('../viewModel.assemblers/view.treasury.cash'),
    chequeView = require('../viewModel.assemblers/view.treasury.cheque'),
    receiptView = require('../viewModel.assemblers/view.treasury.receipt'),
    demandNote = require('../viewModel.assemblers/view.treasury.demandNote');

class TreasuryPayment
    extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(fiscalPeriodId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            query = knex.from(function () {
                this.select(
                    'treasury.id',
                    'treasury.imageUrl',
                    'treasury.documentType',
                    'treasury.amount',
                    'treasury.transferDate',
                    'treasury.sourceDetailAccountId',
                    knex.raw(`source.title as "sourceTitle"`),
                    'treasury.destinationDetailAccountId',
                    knex.raw(`destination.title as "destinationTitle"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin('detailAccounts as source', 'source.id', 'treasury.sourceDetailAccountId')
                    .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                    .where('treasury.branchId', branchId)
                    .where('treasuryType', 'payment')
                    .as('base')
            });

        return kendoQueryResolve(query, parameters, view)

    }

    getById(id, receiveType) {
        let knex = this.knex,
            branchId = this.branchId,

            query = await(knex.select(
                'treasury.*',
                'treasuryDocumentDetails.*',
                knex.raw(`"sourceDetailAccounts".title as "sourceTitle"`),
                knex.raw(`"destinationDetailAccounts".title as "destinationTitle"`),
                knex.raw(`"bankDetailAccounts".title as "bankDisplay"`)
                )
                    .from('treasury')
                    .leftJoin(knex.raw(`(select da.title, da.id
                                     from "detailAccounts" as da )as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select da.title, da.id
                                     from "detailAccounts" as da )as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .where('treasury.branchId', branchId)
                    .where('treasury.id', id)
                    .first()
            );

        if (receiveType === 'cheque') {
            return chequeView(query);
        }

        if (receiveType === 'cash') {
            return cashView(query);
        }

        if (receiveType === 'receipt') {
            return receiptView(query);
        }

        if (receiveType === 'demandNote') {
            return demandNote(query);
        }

        return view(query);
    }

}

module.exports = TreasuryPayment;