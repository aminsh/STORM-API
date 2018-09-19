import toResult from "asyncawait/await";
import {injectable} from "inversify";
import {BaseQuery} from "../../Infrastructure/BaseQuery";

@injectable()
export class JournalTemplateQuery extends BaseQuery {

    tableName = "journalTemplates";

    getAll(parameters) {

        const query = this.knex.from(this.tableName).where({branchId: this.branchId});

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view));
    }

    getById(id) {

        const entity = toResult(
            this.knex.select('*').from(this.tableName).where({branchId: this.branchId, id}).first()
        );

        return this._view(entity);
    }

    _view(entity) {

        return {
            id: entity.id,
            title: entity.title,
            journalId: entity.journalId
        };
    }
}