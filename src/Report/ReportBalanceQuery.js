import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";
import groupBy from "../Bookkeeping/AccountReview/journalQueryGrouped";

@injectable()
export class ReportBalanceQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getGeneralBalance() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let journals = `"groupJournals"."sumDebtor" as "debtor",
            "groupJournals"."sumCreditor" as "creditor",
            "groupJournals"."totalDebtorRemainder" as "totalDebtor",
            "groupJournals"."totalCreditorRemainder" as "totalCreditor",
            
            CASE WHEN "groupJournals"."remainder" < 0 
            THEN "groupJournals"."remainder" 
                 ELSE 0 END as "creditorRemainderCurrent",
                 
            CASE WHEN "groupJournals"."remainder" > 0 
            THEN "groupJournals"."remainder" 
                 ELSE 0 END as "debtorRemainderCurrent",
                 
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
            "generalLedgerAccounts".id as "generalId",
            CASE WHEN "generalLedgerAccounts".code ISNULL 
            THEN "generalLedgerAccounts".title 
            ELSE "generalLedgerAccounts".title||' ${'کد'} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let query = toResult(knex.select(knex.raw(journals + ',' + generalLedgerAccounts))
            .from(function () {
                groupBy.call(this, knex,
                    options,
                    currentFiscalPeriodId, 'generalLedgerAccountId');
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .as('totalJournals'));


        let result = query.asEnumerable().select(item =>
            Object.assign({}, item,
                {
                    debtorT: item.debtor.toString(),
                    creditorT: item.creditor.toString(),
                    totalDebtorT: item.totalDebtor.toString(),
                    totalCreditorT: item.totalCreditor.toString(),
                    creditorRemainderCurrentT: item.creditorRemainderCurrent.toString(),
                    debtorRemainderCurrentT: item.debtorRemainderCurrent.toString(),
                    creditorRemainderT: item.creditorRemainder.toString(),
                    debtorRemainderT: item.debtorRemainder.toString(),
                    sumBeforeDebtorT: item.sumBeforeDebtor.toString(),
                    sumBeforeCreditorT: item.sumBeforeCreditor.toString(),
                    fromDate: options.fromMainDate,
                    toDate: options.toDate

                })
        ).toArray();

        return result;

    };

    getSubsidiaryBalance() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

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
            ELSE "generalLedgerAccounts".title||' ${'کد'} ' || "generalLedgerAccounts".code END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".id as subsidiaryId,
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${'کد'} ' ||"subsidiaryLedgerAccounts".code END AS subsidiaryDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' + subsidiaryLedgerAccounts))
            .from(function () {
                groupBy.call(this, knex,
                    options,
                    currentFiscalPeriodId, ['generalLedgerAccountId', 'subsidiaryLedgerAccountId']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .as('detailJournals');

        return query;
    };

    getSubsidiaryDetailBalance() {
        let options = this.reportConfig.options,
            knex = this.knex,
            currentFiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.state.user.id;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

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
            ELSE "generalLedgerAccounts".title||' ${'کد'} ' || "generalLedgerAccounts".code 
            END AS generalDisplay`;

        let subsidiaryLedgerAccounts = `"subsidiaryLedgerAccounts".code as subsidiaryCode,
            "subsidiaryLedgerAccounts".id as "subsidiaryId",
            "subsidiaryLedgerAccounts".title as subsidiaryTitle,
            CASE WHEN "subsidiaryLedgerAccounts".code ISNULL 
            THEN "subsidiaryLedgerAccounts".title 
            ELSE "subsidiaryLedgerAccounts".title||' ${'کد'} ' ||"subsidiaryLedgerAccounts".code 
            END AS subsidiaryDisplay`;

        let detailAccounts = `"detailAccounts".code as detailCode,
            "detailAccounts".id as detailId,
            "detailAccounts".title as detailTitle,
            CASE WHEN "detailAccounts".code ISNULL 
            THEN "detailAccounts".title 
            ELSE "detailAccounts".title||' ${'کد'} ' || "detailAccounts".code END AS detailDisplay`;

        let query = knex.select(knex.raw(journals + ',' + generalLedgerAccounts + ',' +
            subsidiaryLedgerAccounts + ',' + detailAccounts))
            .from(function () {
                groupBy.call(this, knex,
                    options, currentFiscalPeriodId,
                    ['generalLedgerAccountId', 'subsidiaryLedgerAccountId', 'detailAccountId']);
            })
            .leftJoin('generalLedgerAccounts', 'groupJournals.generalLedgerAccountId', 'generalLedgerAccounts.id')
            .leftJoin('subsidiaryLedgerAccounts', 'groupJournals.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
            .leftJoin('detailAccounts', 'groupJournals.detailAccountId', 'detailAccounts.id')
            .as('detailJournals');

        return toResult(query);
    };

}