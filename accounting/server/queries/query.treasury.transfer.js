"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../../../application/src/FiscalPeriod/FiscalPeriodQuery'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.treasury.transfer');

class TreasuryTransfer
    extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
    }

    getAll(fiscalPeriodId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            fiscalPeriodQuery = new FiscalPeriodQuery(this.branchId),
            fiscalPeriod = await(fiscalPeriodQuery.getById(fiscalPeriodId)),

            query = knex.from(function () {
                this.select(
                    'treasury.id',
                    'treasury.imageUrl',
                    'treasury.amount',
                    'treasury.transferDate',
                    'treasury.sourceDetailAccountId',
                    'treasury.createdAt',
                    knex.raw(`source.title as "sourceTitle"`),
                    'treasury.destinationDetailAccountId',
                    knex.raw(`destination.title as "destinationTitle"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin('detailAccounts as source', 'source.id', 'treasury.sourceDetailAccountId')
                    .leftJoin('detailAccounts as destination', 'destination.id', 'treasury.destinationDetailAccountId')
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('treasuryType', 'transfer')
                    .as('base')
            });

        return kendoQueryResolve(query, parameters, view)

    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,

            treasury = await(knex.select(
                'treasury.id',
                'treasury.imageUrl',
                'treasury.transferDate',
                'treasury.sourceDetailAccountId',
                'treasury.destinationDetailAccountId',
                'treasury.amount',
                'treasury.journalId',
                'treasury.description',
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
                    .modify(modify, branchId, userId, canView, 'treasury')
                    .where('treasury.id', id)
                    .first()
            );

        if (treasury) {
            let journal = treasury.journalId ? await(knex.select(
                'journals.temporaryDate as date',
                'journals.temporaryNumber as number',
                'journals.id',
                'journals.description',
                'journals.createdAt'
                )
                    .from('journals')
                    .where('id', treasury.journalId)
                    .where('branchId', branchId)
                    .first()
            ) : null;

            treasury.journal = journal;
        }
        return treasury ? view(treasury) : [];
    }

}

module.exports = TreasuryTransfer;