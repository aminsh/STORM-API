"use strict";

const BaseQuery = require('../queries/query.base'),
    filterQueryConfig = require('./report.filter.config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');


class BalanceSheet extends BaseQuery {
    constructor(branchId, currentFiscalPeriod, mode, filter, userId) {
        super(branchId, userId);

        this.currentFiscalPeriod = currentFiscalPeriod;
        this.mode = mode;
        this.filter = filter;
        this.filterConfig = new filterQueryConfig(branchId, currentFiscalPeriod, mode, filter);
        this.options = await(this.filterConfig.getDateOptions());
    }

    getBalanceSheet() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify,
            options = this.options;

        return await(knex.select(knex.raw(`
                    DISTINCT 
                    "generalLedgerAccounts"."id" as "generalLedgerAccountId",
                    "accountCategories"."key" as "accountCategoriesKey",
                    "accountCategories".display as "accountCategoriesDisplay",
                    "generalLedgerAccounts".code as "generalLedgerAccountsCode",
                    "generalLedgerAccounts".title as "generalLedgerAccountsTitle",
                    COALESCE(journal.creditor,0) as creditor, COALESCE(journal.debtor,0) as debtor,
                    COALESCE(journal.remainder,0) as remainder`))
            .from('generalLedgerAccounts')
            .innerJoin('accountCategories', function () {
                this.on('accountCategories.key', 'generalLedgerAccounts.groupingType')
                    .andOn('accountCategories.branchId', 'generalLedgerAccounts.branchId')
            })
            .leftJoin(knex.raw(`(SELECT "journalLines"."generalLedgerAccountId", 
                                SUM("journalLines".debtor) as debtor, SUM("journalLines".creditor) as creditor,
                                SUM("journalLines".debtor - "journalLines".creditor) as remainder
                            FROM journals
                            INNER JOIN "journalLines" on "journalLines"."journalId" = journals."id"
                            WHERE  journals."journalStatus" != 'Temporary'
                                AND journals."branchId" = '${branchId}'
                                AND ('${canView}' or journals."createdById" = '${userId}')
                                AND journals."temporaryDate" BETWEEN '${options.fromMainDate}' AND '${options.toDate}'                   
                            GROUP BY "journalLines"."generalLedgerAccountId") as journal`),
                'journal.generalLedgerAccountId', '=', 'generalLedgerAccounts.id')
            .modify(modify, branchId, userId, canView, 'generalLedgerAccounts')
            .whereIn('accountCategories.key', ['10', '20', '30', '40', '50', '11', '12', '21', '22', '31'])
            .orderBy('generalLedgerAccountsCode', 'asc')
        );
    }
}

module.exports = BalanceSheet;