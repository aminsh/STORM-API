import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import groupBy from "../Bookkeeping/AccountReview/journalQueryGrouped";

@injectable()
export class ReportTurnoverQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;
    
    getTotalTurnover() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let journals = `"groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."sumRemainder" as "remainder"`;

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

        return toResult(knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' +
            subsidiaryLedgerAccounts + ',' + detailAccounts))
            .from(function () {
                groupBy.call(this, knex, options, currentFiscalPeriodId,
                    ['generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'detailAccountId']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('totalJournals'));

    }

    getDetailTurnover() {

        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let journals = `"groupJournals"."periodId" as "journalPeriodId",
            "groupJournals"."number" as "number",
            "groupJournals"."date" as "date",
            "groupJournals"."description" as "journalsDescription",
            "groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."journalType" as "journalType",
            "groupJournals"."article" as "article",
            "groupJournals"."sumRemainder" as "remainder",
            "groupJournals"."sumBeforeRemainder" as "beforeRemainder"`;

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
                groupBy.call(this, knex, options, currentFiscalPeriodId,
                    ['periodId','number','date','generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'detailAccountId',
                        'journalType','description','article']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('detailJournals');

        return toResult(query);
    }

}
