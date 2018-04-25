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
    enums = instanceOf('Enums');

class TreasuryReceive
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
                    'treasury.createdAt',
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
                    .where('treasuryType', 'receive')
                    .as('base')
            });

        return kendoQueryResolve(query, parameters, view)

    }

    getAllCheques(parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.from(function () {
                this.select(
                    'treasury.id',
                    'treasury.amount',
                    'treasury.transferDate',
                    knex.raw(`treasury."sourceDetailAccountId" as "payerId"`),
                    knex.raw(`treasury."destinationDetailAccountId" as "receiverId"`),
                    knex.raw(`source.title as "payerTitle"`),
                    knex.raw(`destination.title as "receiverTitle"`),
                    'treasuryDocumentDetails.status',
                    'treasuryDocumentDetails.number',
                    'treasuryDocumentDetails.dueDate',
                    'treasury.isCompleted'
                )
                    .from('treasury')
                    .leftJoin('detailAccounts as source', 'source.id', 'treasury.sourceDetailAccountId')
                    .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                    .leftJoin('treasuryDocumentDetails', 'treasuryDocumentDetails.id', 'treasury.documentDetailId')
                    .where('treasury.branchId', branchId)
                    .where('treasuryType', 'receive')
                    .where('treasury.documentType', 'cheque')
                    .as('base')
            }),

            chequeView = (item) => ({
                id: item.id,
                transferDate: item.transferDate,
                amount: item.amount,
                payerId: item.payerId,
                payerTitle: item.payerTitle,
                receiverId: item.receiverId,
                receiverTitle: item.receiverTitle,
                number: item.number,
                dueDate: item.dueDate,
                status: item.status,
                statusDisplay: enums.ReceiveChequeStatus().getDisplay(item.status),
                isCompleted: item.isCompleted
            });

        return kendoQueryResolve(query, parameters, chequeView)
    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,

            treasury = await(knex.select(
                'treasury.*',
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
                    .where('treasury.branchId', branchId)
                    .where('treasury.id', id)
                    .first()
            ),

            documentDetail = await(knex.select('treasuryDocumentDetails.*')
                .from('treasuryDocumentDetails')
                .where('id', treasury.documentDetailId)
                .where('branchId', branchId)
                .first()
            ),

            journalIds = treasury.documentType === 'cheque' && documentDetail.chequeStatusHistory
                ? documentDetail.chequeStatusHistory.asEnumerable()
                    .where(e => e.journalId)
                    .select(item => item.journalId)
                    .toArray()
                : treasury.journalId ? [treasury.journalId] : null;

        let journals = (journalIds || []).length > 0
            ? await(knex.select(
                'journals.temporaryDate as date',
                'journals.temporaryNumber as number',
                'journals.id',
                'journals.description'
                )
                    .from('journals')
                    .whereIn('id', journalIds)
                    .where('branchId', branchId)
            )
            : null;


        treasury.documentDetail = documentDetail;
        treasury.journals = journals;

        if (treasury.documentType === 'cheque') {
            return chequeView(treasury);
        }

        if (treasury.documentType === 'cash') {
            return cashView(treasury);
        }

        if (treasury.documentType === 'receipt') {
            return receiptView(treasury);
        }

        if (treasury.documentType === 'demandNote') {
            return demandNote(treasury);
        }

        return view(treasury);
    }

}

module.exports = TreasuryReceive;