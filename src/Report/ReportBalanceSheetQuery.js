import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable, inject} from "inversify";

@injectable()
export class ReportBalanceSheetQuery extends BaseQuery {

    @inject("ReportConfig")
    /**@type{ReportConfig}*/ reportConfig = undefined;

    getBalanceSheet() {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.state.user.id,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),
            options = this.reportConfig.options;

        return toResult(knex.select(knex.raw(`
                    DISTINCT 
                    "generalLedgerAccounts"."id" as "generalLedgerAccountId",
                    "accountCategories"."key" as "accountCategoriesKey",
                    "accountCategories".display as "accountCategoriesDisplay",
                    "generalLedgerAccounts".code as "generalLedgerAccountsCode",
                    "generalLedgerAccounts".title as "generalLedgerAccountsTitle",
                    COALESCE(journal.creditor,0) as creditor, COALESCE(journal.debtor,0) as debtor,
                    COALESCE(journal.remainder,0) as remainder`))
            .from('generalLedgerAccounts')
            .innerJoin('accountCategories', function () {
                this.on('accountCategories.key', 'generalLedgerAccounts.groupingType')
                    .andOn('accountCategories.branchId', 'generalLedgerAccounts.branchId')
            })
            .leftJoin(knex.raw(`(SELECT "journalLines"."generalLedgerAccountId", 
                                SUM("journalLines".debtor) as debtor, SUM("journalLines".creditor) as creditor,
                                SUM("journalLines".debtor - "journalLines".creditor) as remainder
                            FROM journals
                            INNER JOIN "journalLines" on "journalLines"."journalId" = journals."id"
                            WHERE  journals."journalStatus" != 'Temporary'
                                AND journals."branchId" = '${branchId}'
                                AND ('${canView}' or journals."createdById" = '${userId}')
                                AND journals."temporaryDate" BETWEEN '${options.fromMainDate}' AND '${options.toDate}'                   
                            GROUP BY "journalLines"."generalLedgerAccountId") as journal`),
                'journal.generalLedgerAccountId', '=', 'generalLedgerAccounts.id')
            .modify(modify, branchId, userId, canView, 'generalLedgerAccounts')
            .whereIn('accountCategories.key', ['10', '20', '30', '40', '50', '11', '12', '21', '22', '31'])
            .orderBy('generalLedgerAccountsCode', 'asc')
        );
    }
}