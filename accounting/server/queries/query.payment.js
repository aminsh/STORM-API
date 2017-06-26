"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../shared/enums');

module.exports = class PaymentQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
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
                    .orderBy('payments.date','desc')
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
};
