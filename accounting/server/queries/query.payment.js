"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../../shared/enums');

class PaymentQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
    }

    getReceivableCheques(parameters) {
        let branchId = this.branchId,
            knex = this.knex,
            query = knex.from(function () {
                this.select(
                    'payments.id',
                    'payments.number',
                    'payments.date',
                    'payments.bankName',
                    'payments.bankBranch',
                    'payments.chequeStatus',
                    'journalLines.detailAccountId',
                    knex.raw(`(select "title" from "detailAccounts" where "id" = "journalLines"."detailAccountId" limit 1 ) as "detailAccountDisplay"`)
                )
                    .from('payments')
                    .leftJoin('journalLines', 'payments.journalLineId', 'journalLines.id')
                    .where('payments.branchId', branchId)
                    .andWhere('receiveOrPay', 'receive')
                    .andWhere('paymentType', 'cheque')
                    .orderBy('payments.date', 'desc')
                    .as("base");
            }),

            view = entity => ({
                id: entity.id,
                number: entity.number,
                date: entity.date,
                bankName: entity.bankName,
                bankBranch: entity.bankBranch,
                detailAccountId: entity.detailAccountId,
                detailAccountDisplay: entity.detailAccountDisplay,
                chequeStatus: entity.chequeStatus,
                chequeStatusDisplay: entity.chequeStatus
                    ? enums.ChequeStatus().getDisplay(entity.chequeStatus)
                    : ''
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getPayableCheques(parameters) {
        let branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            knex = this.knex,
            query = knex.from(function () {
                this.select(
                    'payments.id',
                    'payments.number',
                    'payments.date',
                    'payments.bankName',
                    'payments.bankBranch',
                    'payments.chequeStatus',
                    'journalLines.detailAccountId',
                    knex.raw(`(select "title" from "detailAccounts" where "id" = "journalLines"."detailAccountId" limit 1 ) as "detailAccountDisplay"`)
                )
                    .from('payments')
                    .leftJoin('journalLines', 'payments.journalLineId', 'journalLines.id')
                    .modify(modify, branchId, userId, canView,'payments')
                    .andWhere('receiveOrPay', 'pay')
                    .andWhere('paymentType', 'cheque')
                    .orderBy('payments.date', 'desc')
                    .as("base");
            }),

            view = entity => ({
                id: entity.id,
                number: entity.number,
                date: entity.date,
                bankName: entity.bankName,
                bankBranch: entity.bankBranch,
                detailAccountId: entity.detailAccountId,
                detailAccountDisplay: entity.detailAccountDisplay,
                chequeStatus: entity.chequeStatus,
                chequeStatusDisplay: entity.chequeStatus
                    ? enums.ChequeStatus().getDisplay(entity.chequeStatus)
                    : ''
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getPeymentsByInvoiceId(invoiceId) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify;

        return knex.select(
            'payments.id',
            'payments.amount',
            'payments.date',
            'payments.number',
            'payments.paymentType',
            'journalLines.detailAccountId',
            knex.raw('"detailAccounts".title as "detailAccountDisplay"')
        )
            .from('payments')
            .leftJoin('journalLines', 'journalLines.id', 'payments.journalLineId')
            .leftJoin('detailAccounts', 'detailAccounts.id', 'journalLines.detailAccountId')
            .modify(modify, branchId, userId, canView,'payments')
            .andWhere('payments.invoiceId', invoiceId)
            .map(entity => ({
                id: entity.id,
                amount: entity.amount,
                date: entity.date,
                number: entity.number,
                paymentType: entity.paymentType,
                paymentTypeDisplay: entity.paymentType
                    ? enums.paymentType().getDisplay(entity.paymentType)
                    : '',
                bankId: entity.paymentType === 'receipt' ? entity.detailAccountId : undefined,
                bankDisplay: entity.paymentType === 'receipt' ? entity.detailAccountDisplay : undefined,
                fundId: entity.paymentType === 'cash' ? entity.detailAccountId : undefined,
                fundDisplay: entity.paymentType === 'cash' ? entity.detailAccountDisplay : undefined,
            }));
    }
}

module.exports = PaymentQuery;
