"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums'),
    baseJournals = require('./query.journal.base');

module.exports = class ReportQueryJournals extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId) {
        super(branchId);

        this.currentFiscalPeriodId = currentFiscalPeriodId;
    };

    getTotalJournals(parameter) {
        let knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"baseJournals"."temporaryNumber" as "temporaryNumber",
            "baseJournals"."temporaryDate" as "temporaryDate",
            "baseJournals".number as "journalNumber",
            "baseJournals".date as "journalsDate",
            "baseJournals".description as "journalsDescription",
            "baseJournals"."debtor" as "debtor",
            "baseJournals"."creditor" as "creditor"`;

        let generalLedgerAccounts = `CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' کد ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' کد ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let detailAccounts = `CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' کد ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals +','+ generalLedgerAccounts+','+
                            subsidiaryLedgerAccounts +','+ detailAccounts))
            .from(function () {
                baseJournals.call(this, parameter, currentFiscalPeriodId, knex);
            })
            .leftJoin('generalLedgerAccounts', 'baseJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'baseJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'baseJournals.detailAccountId', 'detailAccounts.id')
            .as('totalJournals')
        return query;
    };


    getDetailJournals(parameter) {
        let knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"baseJournals".id as "journalId",
            "baseJournals"."periodId" as "journalPeriodId",
            "baseJournals"."temporaryNumber" as "temporaryNumber",
            "baseJournals"."temporaryDate" as "temporaryDate",
            "baseJournals".number as "journalNumber",
            "baseJournals".date as "journalsDate",
            "baseJournals".description as "journalsDescription",
            "baseJournals"."debtor" as "debtor",
            "baseJournals"."creditor" as "creditor",
            "baseJournals"."chequeNumber" as "chequeNumber",
            "baseJournals"."chequeDate" as "chequeDate",
            "baseJournals".article as "article",
            "baseJournals".row as "journalLinesRow"`;

        let generalLedgerAccounts = `CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' کد ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' کد ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let detailAccounts = `CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' کد ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals +','+ generalLedgerAccounts+','+
                            subsidiaryLedgerAccounts +','+ detailAccounts))
            .from(function () {
                baseJournals.call(this, parameter, currentFiscalPeriodId, knex);
            })
            .leftJoin('generalLedgerAccounts', 'baseJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'baseJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'baseJournals.detailAccountId', 'detailAccounts.id')
            .as('detailJournals')
        return query;
    };

}