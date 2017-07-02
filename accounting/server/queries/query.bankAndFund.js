"use strict";

"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../shared/enums');

class BandQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getSummary(fiscalPeriodId) {
        let knex = this.knex;

        return knex.select(
            'journalLines.detailAccountId',
            'detailAccounts.detailAccountType',
            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
            knex.raw('"sum"("journalLines"."debtor" - "journalLines"."creditor") as "remainder"')
        )
            .from('journalLines')
            .leftJoin('journals', 'journalLines.journalId', 'journals.id')
            .leftJoin(
                'subsidiaryLedgerAccounts',
                'journalLines.subsidiaryLedgerAccountId',
                'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
            .where('journalLines.branchId', this.branchId)
            .andWhere('journals.periodId', fiscalPeriodId)
            .andWhereBetween('subsidiaryLedgerAccounts.code', ['1101', '1103'])
            .whereIn('detailAccounts.detailAccountType',['bank','fund'])
            .groupBy(
                'journalLines.detailAccountId',
                'detailAccounts.detailAccountType',
                'detailAccounts.title'
            )
            .map(item => ({
                accountId: item.detailAccountId,
                accountType: item.detailAccountType,
                accountTypeDisplay: item.detailAccountType
                    ? enums.DetailAccountType().getDisplay(item.detailAccountType)
                    : '',
                accountName: item.detailAccountDisplay,
                remainder: item.remainder
            }));
    }

    getById(id) {
        let bank = await(this.knex.select().from('banks').where('id', id).first());
        return view(bank);
    }
}

module.exports = BandQuery;