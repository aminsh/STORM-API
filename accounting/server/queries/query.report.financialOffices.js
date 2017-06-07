"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums'),
    groupJournals = require('./query.journal.grouped'),
    JournalQueryConfig = require('./query.journal.config'),
    translate = require('../services/translateService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class ReportQueryFinancialOffices extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);

        this.journalConfig = new JournalQueryConfig(branchId, currentFiscalPeriodId, mode, filter);
        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode;
        this.filter = filter;

        this.getJournalOffice = async(this.getJournalOffice);
        this.getGeneralOffice = async(this.getGeneralOffice);
        this.getSubsidiaryOffice = async(this.getSubsidiaryOffice);
    };

    getJournalOffice() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"groupJournals".number as "number",
            "groupJournals".date as "date",
            "groupJournals".article as "article",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor"`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${translate('Code')} ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' + subsidiaryLedgerAccounts))
            .from(function () {
                groupJournals.call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['number','date','generalLedgerAccountId', 'subsidiaryLedgerAccountId','article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .as('article')
        return query;
    };

    getGeneralOffice() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"groupJournals".number as "number",
            "groupJournals".date as "date",
            "groupJournals".article as "article",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."sumRemainder" as remainder`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts))
            .from(function () {
                groupJournals.call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['number','date','generalLedgerAccountId','article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .as('totalJournals')
        return query;
    };

    getSubsidiaryOffice() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"groupJournals".number as "number",
            "groupJournals".date as "date",
            "groupJournals".article as "article",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."sumRemainder" as remainder`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${translate('Code')} ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' + subsidiaryLedgerAccounts))
            .from(function () {
                groupJournals.call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['number','date','generalLedgerAccountId','subsidiaryLedgerAccountId','article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .as('totalJournals')
        return query;
    };

}