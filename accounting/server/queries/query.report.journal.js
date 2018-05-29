"use strict";

const BaseQuery = require('./query.base'),
    enums = instanceOf('Enums'),
    groupJournals = require('./query.journal.grouped'),
    JournalQueryConfig = require('./query.journal.config'),
    translate = require('../services/translateService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class ReportQueryJournals extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter, userId) {
        super(branchId, userId);

        this.journalConfig = new JournalQueryConfig(branchId, currentFiscalPeriodId, mode, filter);
        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode;
        this.filter = filter;

        this.getTotalJournals = async(this.getTotalJournals);
        this.getDetailJournals = async(this.getDetailJournals);
    };

    getTotalJournals() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        let journals = `"groupJournals"."temporaryNumber" as "number", 
            "groupJournals"."temporaryDate" as "date",
            "groupJournals".month as "journalmonth",
            "groupJournals".description as "journalsDescription",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            CASE WHEN "groupJournals"."journalStatus"= 'BookKeeped' 
                THEN '${translate('Bookkeep')}' 
                ELSE '${translate('New Journal')}' END AS "journalStatusText"`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${translate('Code')} ' || "generalLedgerAccounts".code 
            END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${translate('Code')} ' ||"subsidiaryLedgerAccounts".code 
            END AS subsidiaryDisplay`;

        let detailAccounts = `"detailAccounts".code as detailCode,
            "detailAccounts".title as detailTitle,
            CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' ${translate('Code')} ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' +
            subsidiaryLedgerAccounts + ',' + detailAccounts))
            .from(function () {
                groupJournals.call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['temporaryNumber','temporaryDate','month','generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'detailAccountId',
                        'journalStatus','description']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('totalJournals')

        return query;
    };


    getDetailJournals() {
        let options = await(this.journalConfig.getOptions()),
            knex = this.knex,
            currentFiscalPeriodId = this.currentFiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView();
        options.modify = this.modify;

        let journals = `"groupJournals".id as "journalId",
            "groupJournals"."periodId" as "journalPeriodId",
            "groupJournals"."temporaryDate" as "date",
            "groupJournals"."temporaryNumber" as "number",
            "groupJournals".month as "month",
            "groupJournals".description as "journalsDescription",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals".article as "article",
            "groupJournals".row as "row",
            CASE WHEN "groupJournals"."journalStatus"= 'BookKeeped' 
                THEN '${translate('Bookkeep')}' 
                ELSE '${translate('New Journal')}' END AS "journalStatusText"`;

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

        let detailAccounts = `"detailAccounts".code as detailCode,
            "detailAccounts".title as detailTitle,
            CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' ${translate('Code')} ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' +
            subsidiaryLedgerAccounts + ',' + detailAccounts))
            .from(function () {
                groupJournals.call(this, knex, options, currentFiscalPeriodId,
                    ['id','periodId','temporaryNumber','temporaryDate','month','generalLedgerAccountId', 'subsidiaryLedgerAccountId',
                        'journalStatus','detailAccountId','description','row','article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('detailJournals')
        return query;
    };

}

module.exports = ReportQueryJournals;