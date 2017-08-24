"use strict";

const BaseQuery = require('./query.base'),
    enums = instanceOf('Enums'),
    groupJournals = require('./query.journal.grouped'),
    JournalQueryConfig = require('./query.journal.config'),
    translate = require('../services/translateService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class ReportQueryBalance extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);

        this.journalConfig = new JournalQueryConfig(branchId, currentFiscalPeriodId, mode, filter);
        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode;
        this.filter = filter;

        this.getGeneralBalance = async(this.getGeneralBalance);
        this.getSubsidiaryBalance = async(this.getSubsidiaryBalance);
        this.getSubsidiaryDetailBalance = async(this.getSubsidiaryDetailBalance);
    };

    getGeneralBalance() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."totalDebtorRemainder" as "totalDebtor",
            "groupJournals"."totalCreditorRemainder" as "totalCreditor",
            CASE WHEN "groupJournals"."totalRemainder" < 0 
            THEN "groupJournals"."totalRemainder" 
            ELSE 0 END as "creditorRemainder",
            CASE WHEN "groupJournals"."totalRemainder" > 0 
            THEN "groupJournals"."totalRemainder" 
            ELSE 0 END as "debtorRemainder",
            "groupJournals"."sumBeforeDebtor" as "sumBeforeDebtor",
            "groupJournals"."sumBeforeCreditor" as "sumBeforeCreditor"`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts))
            .from(function () {
                groupJournals.call(this, knex,
                    options,
                    currentFiscalPeriodId, 'generalLedgerAccountId');
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .as('totalJournals')
        return query;

    };

    getSubsidiaryBalance() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."totalDebtorRemainder" as "totalDebtor",
            "groupJournals"."totalCreditorRemainder" as "totalCreditor",
            CASE WHEN "groupJournals"."totalRemainder" < 0 
            THEN "groupJournals"."totalRemainder" 
            ELSE 0 END as "creditorRemainder",
            CASE WHEN "groupJournals"."totalRemainder" > 0 
            THEN "groupJournals"."totalRemainder" 
            ELSE 0 END as "debtorRemainder",
            "groupJournals"."sumBeforeDebtor" as "beforeRemainderDebtor",
            "groupJournals"."sumBeforeCreditor" as "beforeRemainderCreditor"`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as "generalCode",
            "generalLedgerAccounts".id as "generalId",
            "generalLedgerAccounts".title as "generalTitle",
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".id as subsidiaryId,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${translate('Code')} ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' + subsidiaryLedgerAccounts))
            .from(function () {
                groupJournals.call(this, knex,
                    options,
                    currentFiscalPeriodId, ['generalLedgerAccountId', 'subsidiaryLedgerAccountId']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .as('detailJournals')
        return query;
    };

    getSubsidiaryDetailBalance() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."totalDebtorRemainder" as "totalDebtor",
            "groupJournals"."totalCreditorRemainder" as "totalCreditor",
            CASE WHEN "groupJournals"."totalRemainder" < 0 
            THEN "groupJournals"."totalRemainder" 
            ELSE 0 END as "creditorRemainder",
            CASE WHEN "groupJournals"."totalRemainder" > 0 
            THEN "groupJournals"."totalRemainder" 
            ELSE 0 END as "debtorRemainder",
            "groupJournals"."sumBeforeDebtor" as "beforeRemainderDebtor",
            "groupJournals"."sumBeforeCreditor" as "beforeRemainderCreditor"`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".id as "generalId",
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' || "generalLedgerAccounts".code 
            END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".id as "subsidiaryId",
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${translate('Code')} ' ||"subsidiaryLedgerAccounts".code 
            END AS subsidiaryDisplay`;

        let detailAccounts = `"detailAccounts".code as detailCode,
            "detailAccounts".id as detailId,
            "detailAccounts".title as detailTitle,
            CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' ${translate('Code')} ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' +
            subsidiaryLedgerAccounts + ',' + detailAccounts))
            .from(function () {
                groupJournals.call(this, knex,
                    options, currentFiscalPeriodId,
                    ['generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'detailAccountId']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('detailJournals')
        return query;
    };

}