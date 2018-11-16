import toResult from "asyncawait/await";
import {injectable} from "inversify";
import {BaseQuery} from "../Infrastructure/BaseQuery";

@injectable()
export class StockQuery extends BaseQuery {

    tableName = "stocks";

    getAll(parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            tableName = this.tableName,

            query = knex.select()
                .from(function () {
                    this.select('*')
                        .from(tableName)
                        .where('branchId', branchId)
                        .as('base');
                });
        return toResult(Utility.kendoQueryResolve(query, parameters, this._view));
    }

    getById(id) {

        let entity = toResult(this.knex.select('id', 'title', 'address', 'accountId')
            .from(this.tableName)
            .where('branchId', this.branchId)
            .where('id', id)
            .first());

        return this._view(entity);
    }

    _view(item) {
        return {
            id: item.id,
            title: item.title,
            address: item.address,
            accountId: item.accountId
        };
    }
}