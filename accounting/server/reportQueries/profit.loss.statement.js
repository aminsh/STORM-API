"use strict";

const BaseQuery = require('../queries/query.base'),
    filterQueryConfig = require('./report.filter.config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');


class ProfitLossStatement extends BaseQuery {
    constructor(branchId, currentFiscalPeriod, mode, filter) {
        super(branchId);

        this.currentFiscalPeriod = currentFiscalPeriod;
        this.mode = mode;
        this.filter = filter;
        this.filterConfig = new filterQueryConfig(branchId, currentFiscalPeriod, mode, filter);
        this.options = await(this.filterConfig.getDateOptions());
    }

    getProfitLossStatement() {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options;

        return await(knex.select(knex.raw(`
                    DISTINCT 
                    "generalLedgerAccounts"."id" as "generalLedgerAccountId",
                    "generalLedgerAccounts".code as "generalLedgerAccountsCode",
                    "generalLedgerAccounts".title as "generalLedgerAccountsTitle",
                    COALESCE(journal.creditor,0) as creditor, COALESCE(journal.debtor,0) as debtor,
                    COALESCE(journal.remainder,0) as remainder,
                    '${options.fromMainDate}' as "fromDate",
                    '${options.toDate}' as "toDate"`))
            .from('generalLedgerAccounts')
            .leftJoin(knex.raw(`(SELECT "journalLines"."generalLedgerAccountId", 
                                SUM("journalLines".debtor) as debtor, SUM("journalLines".creditor) as creditor,
                                SUM("journalLines".debtor - "journalLines".creditor) as remainder
                            FROM journals
                            INNER JOIN "journalLines" on "journalLines"."journalId" = journals."id"
                            WHERE journals."temporaryDate" BETWEEN '${options.fromMainDate}' AND '${options.toDate}'                   
                            GROUP BY "journalLines"."generalLedgerAccountId") as journal`),
                'journal.generalLedgerAccountId', '=', 'generalLedgerAccounts.id')
            .where('generalLedgerAccounts.branchId', branchId)
            .where('generalLedgerAccounts.postingType', 'benefitAndLoss')
            .orderBy('generalLedgerAccountsCode', 'asc')
        );
    }

    getCompareProfitLossStatement() {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options.filter;

        return await(knex.select(knex.raw(`
                    DISTINCT
                    "generalLedgerAccounts"."id" as "generalLedgerAccountIdFirst",
                    "generalLedgerAccounts".code as "generalLedgerAccountsCodeFirst",
                    "generalLedgerAccounts".title as "generalLedgerAccountsTitleFirst",
                    COALESCE(journal.creditor,0) as "creditorFirst", COALESCE(journal.debtor,0) as "debtorFirst",
                    COALESCE(journal.remainder,0) as "remainderFirst",
                    '${options.minDateRangeFirst}' as "fromDateRangeFirst",
                    '${options.maxDateRangeFirst}' as "toDateRangeFirst",
                    "secondResult"."generalLedgerAccountIdSecond",
                    "secondResult"."generalLedgerAccountsCodeSecond",
                    "secondResult"."generalLedgerAccountsTitleSecond",
                    "secondResult"."creditorSecond",
                    "secondResult"."debtorSecond",
                    "secondResult"."remainderSecond",
                    '${options.minDateRangeSecond}' as "fromDateRangeSecond",
                    '${options.maxDateRangeSecond}' as "toDateRangeSecond"`))
            .from('generalLedgerAccounts')
            .leftJoin(knex.raw(`(SELECT "journalLines"."generalLedgerAccountId",
                                SUM("journalLines".debtor) as debtor, SUM("journalLines".creditor) as creditor,
                                SUM("journalLines".debtor - "journalLines".creditor) as remainder
                            FROM journals
                            INNER JOIN "journalLines" on "journalLines"."journalId" = journals."id"
                            WHERE  journals."branchId" = '${branchId}'
                                   AND journals."temporaryDate" BETWEEN '${options.minDateRangeFirst}' AND '${options.maxDateRangeFirst}'
                            GROUP BY "journalLines"."generalLedgerAccountId") as journal`),
                'journal.generalLedgerAccountId', '=', 'generalLedgerAccounts.id')
            .fullOuterJoin(knex.raw(`(
                    SELECT DISTINCT
                            "generalLedgerAccounts"."id" as "generalLedgerAccountIdSecond",
                            "generalLedgerAccounts".code as "generalLedgerAccountsCodeSecond",
                            "generalLedgerAccounts".title as "generalLedgerAccountsTitleSecond",
                            COALESCE(journal.creditor,0) as "creditorSecond", COALESCE(journal.debtor,0) as "debtorSecond",
                            COALESCE(journal.remainder,0) as "remainderSecond"
                    from "generalLedgerAccounts"
                    LEFT JOIN(SELECT "journalLines"."generalLedgerAccountId",
                                                    SUM("journalLines".debtor) as debtor, SUM("journalLines".creditor) as creditor,
                                                    SUM("journalLines".debtor - "journalLines".creditor) as remainder
                                            FROM journals
                                            INNER JOIN "journalLines" on "journalLines"."journalId" = journals."id"
                                            WHERE journals."branchId" = '${branchId}'
                                             AND journals."temporaryDate" BETWEEN '${options.minDateRangeSecond}' AND '${options.maxDateRangeSecond}'
                                            GROUP BY "journalLines"."generalLedgerAccountId") as journal ON journal."generalLedgerAccountId" = "generalLedgerAccounts"."id"
                ) as "secondResult"`), 'secondResult.generalLedgerAccountIdSecond', 'generalLedgerAccounts.id')
            .where('generalLedgerAccounts.branchId', branchId)
            .where('generalLedgerAccounts.postingType', 'benefitAndLoss')
            .orderBy('generalLedgerAccountsCodeFirst', 'asc')
        );
    }
}
module.exports = ProfitLossStatement;