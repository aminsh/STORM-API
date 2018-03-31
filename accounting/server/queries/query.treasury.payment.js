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
    demandNote = require('../viewModel.assemblers/view.treasury.demandNote'),
    queryObjectMapper = require('./queryObjectMapper');

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
            treasuryColumns = queryObjectMapper.columnsToSelect('treasury'),
            treasuryDocumentDetailsColumns = queryObjectMapper.columnsToSelect('treasuryDocumentDetails'),

            query = await(knex.select(
                    ...treasuryColumns,
                    ...treasuryDocumentDetailsColumns,
                knex.raw(`"sourceDetailAccounts".title as "sourceTitle"`),
                knex.raw(`"destinationDetailAccounts".title as "destinationTitle"`)
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
            ),
            result  = queryObjectMapper.mapResult(query, item => Object.assign({}, item.treasury, {documentDetail: item.treasuryDocumentDetails}));

        if (receiveType === 'cheque') {
            return chequeView(result);
        }

        if (receiveType === 'cash') {
            return cashView(result);
        }

        if (receiveType === 'receipt') {
            return receiptView(result);
        }

        if (receiveType === 'demandNote') {
            return demandNote(query);
        }

        return view(query);
    }

}

module.exports = TreasuryPayment;