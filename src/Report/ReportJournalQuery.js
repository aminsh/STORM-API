import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import groupBy from "../Bookkeeping/AccountReview/journalQueryGrouped";

@injectable()
export class ReportJournalQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getTotalJournals() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        let journals = `"groupJournals"."temporaryNumber" as "number", 
            "groupJournals"."temporaryDate" as "date",
            "groupJournals".month as "journalmonth",
            "groupJournals".description as "journalsDescription",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            CASE WHEN "groupJournals"."journalStatus"= 'BookKeeped' 
                THEN '${'ثبت دفترداری'}' 
                ELSE '${'صدور سند'}' END AS "journalStatusText"`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${'کد'} ' || "generalLedgerAccounts".code 
            END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${'کد'} ' ||"subsidiaryLedgerAccounts".code 
            END AS subsidiaryDisplay`;

        let detailAccounts = `"detailAccounts".code as detailCode,
            "detailAccounts".title as detailTitle,
            CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' ${'کد'} ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' +
            subsidiaryLedgerAccounts + ',' + detailAccounts))
            .from(function () {
                groupBy.call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['temporaryNumber','temporaryDate','month','generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'detailAccountId',
                        'journalStatus','description']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('totalJournals');

        return toResult(query);
    };


    getDetailJournals() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

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
                THEN '${'ثبت دفترداری'}' 
                ELSE '${'صدور سند'}' END AS "journalStatusText"`;

        let generalLedgerAccounts = `"generalLedgerAccounts".code as generalCode,
            "generalLedgerAccounts".title as generalTitle,
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${'کد'} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${'کد'} ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let detailAccounts = `"detailAccounts".code as detailCode,
            "detailAccounts".title as detailTitle,
            CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' ${'کد'} ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' +
            subsidiaryLedgerAccounts + ',' + detailAccounts))
            .from(function () {
                groupBy.call(this, knex, options, currentFiscalPeriodId,
                    ['id','periodId','temporaryNumber','temporaryDate','month','generalLedgerAccountId', 'subsidiaryLedgerAccountId',
                        'journalStatus','detailAccountId','description','row','article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('detailJournals');

        return toResult(query);
    };

}