import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../../Infrastructure/BaseQuery";

@injectable()
export class DetailAccountCategoryQuery extends BaseQuery {

    getById(id) {
        let knex = this.knex,
            category = toResult(knex.select('*')
                .from('detailAccountCategories')
                .where('branchId', this.branchId)
                .where('id', id)
                .first()),

            subsidiaryLedgerAccountIds = category.subsidiaryLedgerAccountIds.split('|'),
            subsidiaryLedgerAccounts = toResult(knex
                .select(
                    'id',
                    knex.raw(`"subsidiaryLedgerAccounts".code || ' ' || "subsidiaryLedgerAccounts".title as "display"`))
                .from('subsidiaryLedgerAccounts')
                .where('branchId', this.branchId)
                .whereIn('id',subsidiaryLedgerAccountIds)
            );

        return {
            id: category.id,
            title: category.title,
            subsidiaryLedgerAccounts
        };
    }

    getAll(parameters) {
        let branchId = this.branchId,

            query = this.knex
                .from('detailAccountCategories')
                .where('branchId', branchId),

            view = item => ({
                id: item.id,
                title: item.title
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));
    }
}