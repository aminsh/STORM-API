"use strict";

"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    enums = require('../../../shared/enums');

class BankQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getSummary(fiscalPeriodId) {
        let knex = this.knex,
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
            .where('journalLines.branchId', this.branchId)
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
                remainder: item.remainder
            }));
    }

    getAll(fiscalPeriodId) {
        let knex = this.knex,

            subsidiaryLedgerAccounts = (await(knex.from('settings').where('branchId', this.branchId).first()) || {subsidiaryLedgerAccounts: []})
                .subsidiaryLedgerAccounts,

            subsidiaryLedgerAccount = subsidiaryLedgerAccounts.asEnumerable().toObject(item => item.key, item => item.id),

            remainderSubQuery = knex.raw(`(select sum(CAST(debtor-creditor as FLOAT)) from journals 
                left join "journalLines" on journals.id = "journalLines"."journalId"
                left join "subsidiaryLedgerAccounts" on "journalLines"."subsidiaryLedgerAccountId" = "subsidiaryLedgerAccounts"."id"
                where journals."periodId" = '${fiscalPeriodId}' 
                and journals."branchId" = '${this.branchId}'
                and "detailAccountId" = "detailAccounts"."id"
                and "subsidiaryLedgerAccounts".id in ('${subsidiaryLedgerAccount.bank || 0}', '${subsidiaryLedgerAccount.fund || 0}') ) as "remainder"`);


        return knex.select('*', remainderSubQuery)
            .from('detailAccounts')
            .where('branchId', this.branchId)
            .whereIn('detailAccountType', ['bank', 'fund'])
            .map(item => ({
                id: item.id,
                title: item.title,
                type: item.detailAccountType,
                typeDisplay: item.detailAccountType
                    ? enums.DetailAccountType().getDisplay(item.detailAccountType)
                    : '',
                remainder: getRemainder(item.detailAccountType, item.remainder)
            }));

        function getRemainder(detailAccountType, remainder) {
            if (detailAccountType === 'bank' && !subsidiaryLedgerAccount.bank)
                return '?';

            if (detailAccountType === 'fund' && !subsidiaryLedgerAccount.fund)
                return '?';

            return remainder || 0;
        }
    }


}

module.exports = BankQuery;