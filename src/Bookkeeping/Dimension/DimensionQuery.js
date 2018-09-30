import {BaseQuery} from "../../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {injectable} from "inversify"

@injectable()
export class DimensionQuery extends BaseQuery {

    tableName = "dimensions";

    getAll(categoryId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            tableName = this.tableName,

            query = knex.select().from(function () {
                this.select(knex.raw("*,code || ' ' || title as display"))
                    .from(tableName).as('baseDimensions')
                    .where('branchId', branchId)
                    .andWhere('dimensionCategoryId', categoryId)
                    .as('base');
            });

        return toResult(Utility.kendoQueryResolve(query, parameters, this._view));
    }

    getById(id) {
        let branchId = this.branchId,

            dimension = toResult(
                this.knex.select('*')
                    .from(this.tableName)
                    .where('branchId', branchId)
                    .andWhere('id', id).first());

        return dimension ? this._view(dimension) : [];
    }

    _view(entity) {
        return {
            id: entity.id,
            title: entity.title,
            display: entity.display
        };
    }
}