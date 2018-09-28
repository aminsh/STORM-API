import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../../Infrastructure/BaseQuery";

@injectable()
export class JournalGenerationPurposeQuery extends BaseQuery {

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this),

            query = knex.from(function () {
                this.select(
                    'journalGenerationPurpose.*'
                )
                    .from('journalGenerationPurpose')
                    .modify(modify, branchId, userId, canView)
                    .as('base')
            }),

            view = item => ({
                id: item.id,
                title: item.title,
                subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
                purposesFeatures: (item.purposesFeatures || []).asEnumerable()
                    .select(e => ({
                        key: e.key,
                        title: e.title
                    }))
                    .toArray()
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, view));

    }

    getById(id) {
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView.call(this),
            modify = this.modify.bind(this);

        return toResult(knex.select(
            'journalGenerationPurpose.*'
            )
                .from('journalGenerationPurpose')
                .modify(modify, branchId, userId, canView)
                .where('journalGenerationPurpose.id', id)
                .first()
        );
    }

}
