"use strict";

const BaseQuery = require('../queries/query.base'),
    filterQueryConfig = require('./report.filter.config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = instanceOf('Enums');


class ChequeReportQueries extends BaseQuery {
    constructor(branchId, currentFiscalPeriod, mode, filter) {
        super(branchId);

        this.currentFiscalPeriod = currentFiscalPeriod;
        this.mode = mode;
        this.filter = filter;
        this.filterConfig = new filterQueryConfig(branchId, currentFiscalPeriod, mode, filter);
        this.options = await(this.filterConfig.getDateOptions());
    }

    getChequesDueDate(treasuryType) {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options,

            query = await(knex.select(
                'treasury.transferDate',
                'treasury.description',
                'treasury.amount',
                knex.raw(`"sourceDetailAccounts".title as "sourceTitle"`),
                knex.raw(`"destinationDetailAccounts".title as "destinationTitle"`),
                'treasuryDocumentDetails.number',
                'treasuryDocumentDetails.dueDate',
                'treasuryDocumentDetails.bank',
                'treasuryDocumentDetails.status',
                knex.raw(`'${options.filter.minDate}' as "fromDate"`),
                knex.raw(`'${options.filter.maxDate}' as "toDate"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id
                                     from "detailAccounts")as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id
                                     from "detailAccounts")as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .where('treasury.branchId', branchId)
                    .where('treasury.documentType', 'cheque')
                    .where('treasury.treasuryType', treasuryType)
                    .where('treasury.isCompleted', 'false')
                    .whereBetween('treasuryDocumentDetails.dueDate', [options.fromMainDate, options.toDate])
            );

        query.forEach(item => item.statusDisplay = enums.ReceiveChequeStatus().getDisplay(item.status));

        return query;

    }

    getPassedCheque(treasuryType) {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options,

            query = await(knex.select(
                'treasury.transferDate',
                'treasury.description',
                'treasury.amount',
                knex.raw(`"sourceDetailAccounts".title as "sourceTitle"`),
                knex.raw(`"destinationDetailAccounts".title as "destinationTitle"`),
                'treasuryDocumentDetails.number',
                'treasuryDocumentDetails.dueDate',
                'treasuryDocumentDetails.bank',
                'treasuryDocumentDetails.status',
                knex.raw(`'${options.filter.minDate}' as "fromDate"`),
                knex.raw(`'${options.filter.maxDate}' as "toDate"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id
                                     from "detailAccounts")as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id
                                     from "detailAccounts")as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .where('treasury.branchId', branchId)
                    .where('treasury.documentType', 'cheque')
                    .where('treasury.treasuryType', treasuryType)
                    .where('treasuryDocumentDetails.status', 'passed')
                    .whereBetween('treasuryDocumentDetails.dueDate', [options.filter.minDate, options.filter.maxDate])
            )

        return query;
    }

    getChequesWithStatus(treasuryType) {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options,

            query = await(knex.select(
                'treasury.transferDate',
                'treasury.description',
                'treasury.amount',
                knex.raw(`"sourceDetailAccounts".title as "sourceTitle"`),
                knex.raw(`"destinationDetailAccounts".title as "destinationTitle"`),
                'treasuryDocumentDetails.number',
                'treasuryDocumentDetails.dueDate',
                'treasuryDocumentDetails.bank',
                'treasuryDocumentDetails.status',
                knex.raw(`'${options.filter.minDate}' as "fromDate"`),
                knex.raw(`'${options.filter.maxDate}' as "toDate"`)
                )
                    .from('treasury')
                    .leftJoin('treasuryDocumentDetails', 'treasury.documentDetailId', 'treasuryDocumentDetails.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id
                                     from "detailAccounts")as "sourceDetailAccounts"`),
                        'treasury.sourceDetailAccountId', '=', 'sourceDetailAccounts.id')
                    .leftJoin(knex.raw(`(select "detailAccounts".title, "detailAccounts".id
                                     from "detailAccounts")as "destinationDetailAccounts"`),
                        'treasury.destinationDetailAccountId', '=', 'destinationDetailAccounts.id')
                    .where('treasury.branchId', branchId)
                    .where('treasury.documentType', 'cheque')
                    .where('treasury.treasuryType', treasuryType)
                    .whereBetween('treasuryDocumentDetails.dueDate', [options.fromMainDate, options.toDate])
            );

        query.forEach(item => item.statusDisplay = enums.ReceiveChequeStatus().getDisplay(item.status));

        return query;
    }

}

module.exports = ChequeReportQueries;