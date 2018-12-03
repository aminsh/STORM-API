import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import groupBy from "../Bookkeeping/AccountReview/journalQueryGrouped";
import filterJournals from "../Bookkeeping/AccountReview/journalQueryReportFilter";

@injectable()
export class ReportJournalQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getTotalJournals() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        let journals = `"dateControlJournals"."temporaryNumber" as "number", 
            "dateControlJournals"."temporaryDate" as "date",
            "dateControlJournals".month as "journalmonth",
            "dateControlJournals".description as "journalsDescription",
            "dateControlJournals"."sumDebtor" as "debtor",
            "dateControlJournals"."sumCreditor" as "creditor",
            CASE WHEN "dateControlJournals"."journalStatus"= 'BookKeeped' 
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
            .leftJoin('generalLedgerAccounts', 'dateControlJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'dateControlJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'dateControlJournals.detailAccountId', 'detailAccounts.id')
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

        let journals = `"dateControlJournals".id as "journalId",
            "dateControlJournals"."periodId" as "journalPeriodId",
            "dateControlJournals"."temporaryDate" as "date",
            "dateControlJournals"."temporaryNumber" as "number",
            "dateControlJournals".month as "month",
            "dateControlJournals".description as "journalsDescription",
            "dateControlJournals".article as "article",
            "dateControlJournals"."debtor" as "debtor",
            "dateControlJournals"."creditor" as "creditor",
            "row_number"() OVER() as "row",
            CASE WHEN "dateControlJournals"."journalStatus"= 'BookKeeped' 
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
                filterJournals.call(this, knex, options, currentFiscalPeriodId);
            })
            .leftJoin('generalLedgerAccounts', 'dateControlJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'dateControlJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'dateControlJournals.detailAccountId', 'detailAccounts.id')
            .as('detailJournals');

        return toResult(query);
    };

}