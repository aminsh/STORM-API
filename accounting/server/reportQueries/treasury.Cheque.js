"use strict";

const BaseQuery = require('../queries/query.base'),
    filterQueryConfig = require('./report.filter.config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = instanceOf('Enums'),
    kendoQueryResolve = require('../services/kendoQueryResolve');


class ChequeReportQueries extends BaseQuery {
    constructor(branchId, currentFiscalPeriod, mode, filter) {
        super(branchId);

        this.currentFiscalPeriod = currentFiscalPeriod;
        this.mode = mode;
        this.filter = filter;
        this.filterConfig = new filterQueryConfig(branchId, currentFiscalPeriod, mode, filter);
        this.options = await(this.filterConfig.getDateOptions());
    }

    getChequesDueDate(treasuryType, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options,

            query = knex.from(function () {
                this.select(
                    'treasury.transferDate',
                    'treasury.description',
                    'treasury.amount',
                    'treasury.sourceDetailAccountId',
                    'treasury.destinationDetailAccountId',
                    knex.raw(`"sourceDetailAccounts".title as "payerTitle"`),
                    knex.raw(`"destinationDetailAccounts".title as "receiverTitle"`),
                    'treasuryDocumentDetails.number',
                    'treasuryDocumentDetails.dueDate',
                    'treasuryDocumentDetails.bank',
                    'treasuryDocumentDetails.status',
                    knex.raw(`'${options.fromMainDate}' as "fromDate"`),
                    knex.raw(`'${options.toDate}' as "toDate"`)
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
                    .as('base')
            });

        let view = (item) => ({
            transferDate: item.transferDate,
            description: item.description,
            amount: item.amount,
            payerId: item.sourceDetailAccountId,
            payerTitle: item.payerTitle,
            receiverId: item.destinationDetailAccountId,
            receiverTitle: item.receiverTitle,
            number: item.number,
            dueDate: item.dueDate,
            bank: item.bank,
            status: item.status,
            statusDisplay: enums.ReceiveChequeStatus().getDisplay(item.status),
            fromDate: item.fromDate,
            toDate: item.toDate
        });

        return kendoQueryResolve(query, parameters, view);

    }

    getPassedCheque(treasuryType, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options,

            query = knex.from(function () {
                this.select(
                    'treasury.transferDate',
                    'treasury.description',
                    'treasury.amount',
                    'treasury.sourceDetailAccountId',
                    'treasury.destinationDetailAccountId',
                    knex.raw(`"sourceDetailAccounts".title as "payerTitle"`),
                    knex.raw(`"destinationDetailAccounts".title as "receiverTitle"`),
                    'treasuryDocumentDetails.number',
                    'treasuryDocumentDetails.dueDate',
                    'treasuryDocumentDetails.bank',
                    'treasuryDocumentDetails.status',
                    knex.raw(`'${options.fromMainDate}' as "fromDate"`),
                    knex.raw(`'${options.toDate}' as "toDate"`)
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
                    .whereBetween('treasuryDocumentDetails.dueDate', [options.fromMainDate, options.toDate])
                    .as('base')
            });

        let view = (item) => ({
            transferDate: item.transferDate,
            description: item.description,
            amount: item.amount,
            payerId: item.sourceDetailAccountId,
            payerTitle: item.payerTitle,
            receiverId: item.destinationDetailAccountId,
            receiverTitle: item.receiverTitle,
            number: item.number,
            dueDate: item.dueDate,
            bank: item.bank,
            status: item.status,
            statusDisplay: enums.ReceiveChequeStatus().getDisplay(item.status),
            fromDate: item.fromDate,
            toDate: item.toDate
        });

        return kendoQueryResolve(query, parameters, view);
    }

    getChequesWithStatus(treasuryType, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options,

            query = knex.from(function () {
                this.select(
                    'treasury.transferDate',
                    'treasury.description',
                    'treasury.amount',
                    'treasury.sourceDetailAccountId',
                    'treasury.destinationDetailAccountId',
                    knex.raw(`"sourceDetailAccounts".title as "payerTitle"`),
                    knex.raw(`"destinationDetailAccounts".title as "receiverTitle"`),
                    'treasuryDocumentDetails.number',
                    'treasuryDocumentDetails.dueDate',
                    'treasuryDocumentDetails.bank',
                    'treasuryDocumentDetails.status',
                    knex.raw(`'${options.fromMainDate}' as "fromDate"`),
                    knex.raw(`'${options.toDate}' as "toDate"`)
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
                    .as('base')
            });

        let view = (item) => ({
            transferDate: item.transferDate,
            description: item.description,
            amount: item.amount,
            payerId: item.sourceDetailAccountId,
            payerTitle: item.payerTitle,
            receiverId: item.destinationDetailAccountId,
            receiverTitle: item.receiverTitle,
            number: item.number,
            dueDate: item.dueDate,
            bank: item.bank,
            status: item.status,
            statusDisplay: enums.ReceiveChequeStatus().getDisplay(item.status),
            fromDate: item.fromDate,
            toDate: item.toDate
        });

        return kendoQueryResolve(query, parameters, view);
    }

}

module.exports = ChequeReportQueries;