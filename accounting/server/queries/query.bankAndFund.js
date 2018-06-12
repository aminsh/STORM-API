"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../../shared/enums');

class BankQuery extends BaseQuery {
    constructor(branchId, userId) {
        super(branchId, userId);
    }

    getSummary(fiscalPeriodId) {
        let knex = this.knex,
            branchId = this.branchId,
            canView = this.canView(),
            subsidiaryLedgerAccounts = await(knex.from('settings').where('branchId', this.branchId).first())
                .subsidiaryLedgerAccounts,
            subledger = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item => item.id);

        return knex.select(
            'journalLines.detailAccountId',
            'detailAccounts.detailAccountType',
            knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
            knex.raw('"sum"(CAST("journalLines"."debtor" - "journalLines"."creditor" as FLOAT)) as "remainder"')
        )
            .from('journalLines')
            .leftJoin('journals', 'journalLines.journalId', 'journals.id')
            .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
            .where('journalLines.branchId', branchId)
            .andWhere('journals.periodId', fiscalPeriodId)
            .whereIn('journalLines.subsidiaryLedgerAccountId', [subledger.bank, subledger.fund])
            .whereIn('detailAccounts.detailAccountType', ['bank', 'fund'])
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
                remainder: canView ? item.remainder : '?'
            }));
    }

    getAll(fiscalPeriodId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            canView = this.canView(),
            subsidiaryLedgerAccounts = await(knex.from('settings').where('branchId', this.branchId).first())
                .subsidiaryLedgerAccounts,
            subledger = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item => item.id),

            query = knex.select(
                knex.raw('"detailAccounts"."id" as "detailAccountId"'),
                'detailAccounts.detailAccountType',
                knex.raw('"detailAccounts"."title" as "detailAccountDisplay"'),
                knex.raw('"sum"(coalesce("journalQuery"."debtor" - "journalQuery"."creditor",0)) as "remainder"')
            )
                .from('detailAccounts')
                .leftJoin(knex.raw(`
                    (SELECT "journalLines"."detailAccountId", "journalLines".creditor, "journalLines".debtor 
                        from journals
                        INNER JOIN "journalLines" ON journals."id" = "journalLines"."journalId"
                        WHERE journals."periodId" = '${fiscalPeriodId}'
                            and journals."branchId" = '${branchId}'
	                        and "journalLines"."subsidiaryLedgerAccountId" in ('${subledger.bank || 0}', '${subledger.fund || 0}'))
                         as "journalQuery"`)
                    , 'detailAccounts.id', 'journalQuery.detailAccountId')
                .where('detailAccounts.branchId', branchId)
                .whereIn('detailAccounts.detailAccountType', ['bank', 'fund'])
                .groupBy(
                    'detailAccounts.id',
                    'detailAccounts.detailAccountType',
                    'detailAccounts.title'
                );


        return kendoQueryResolve(query, parameters, item => ({
            id: item.detailAccountId,
            type: item.detailAccountType,
            typeDisplay: item.detailAccountType
                ? enums.DetailAccountType().getDisplay(item.detailAccountType)
                : '',
            title: item.detailAccountDisplay,
            remainder: canView ? item.remainder : '?'
        }));
    }
}

module.exports = BankQuery;