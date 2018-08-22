import {BaseQuery} from "../../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable} from "inversify"

@injectable()
export class DimensionCategoryQuery extends BaseQuery {

    tableName = "dimensionCategories";

    getAll(parameters) {
        let query = this.knex.select()
            .from(this.tableName);
        return toResult(Utility.kendoQueryResolve(query, parameters, this._view));
    }

    getById(id) {
        let category = toResult(
            this.knex.table(this.tableName)
                .andWhere('id', id).first());
        return this._view(category);
    }

    _view(entity) {
        return {
            id: entity.id,
            title: entity.title
        };
    }
}