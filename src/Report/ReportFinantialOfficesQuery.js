import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import groupBy from "../Bookkeeping/AccountReview/journalQueryGrouped";

@injectable()
export class ReportFinancialOfficesQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getJournalOffice() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let journals = `"groupJournals".number as "number",
            "groupJournals".date as "date",
            "groupJournals".article as "article",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor"`;

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

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' + subsidiaryLedgerAccounts))
            .from(function () {
                groupBy().call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['number', 'date', 'generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .as('article');

        return toResult(query);
    };

    getGeneralOffice() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

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
            ELSE "generalLedgerAccounts".title||' ${'کد'} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts))
            .from(function () {
                groupBy().call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['number', 'date', 'generalLedgerAccountId', 'article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .as('totalJournals');

        return toResult(query);
    };

    getSubsidiaryOffice() {

        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

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
            ELSE "generalLedgerAccounts".title||' ${'کد'} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${'کد'} ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' + subsidiaryLedgerAccounts))
            .from(function () {
                groupBy().call(this, knex,
                    options,
                    currentFiscalPeriodId,
                    ['number', 'date', 'generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .as('totalJournals');

        return toResult(query);
    };

}