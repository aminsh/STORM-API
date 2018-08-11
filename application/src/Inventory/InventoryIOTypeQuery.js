import toResult from "asyncawait/await";
import {injectable} from "inversify";
import {BaseQuery} from "../core/BaseQuery";

@injectable()
export class InventoryIOTypeQuery extends BaseQuery {

    tableName = "inventoryIOTypes";

    getAll(type, parameters) {
        let branchId = this.branchId,
            tableName = this.tableName,

            query = this.knex.select().from(function () {
                this.select()
                    .from(tableName)
                    .where('branchId', branchId)
                    .orWhereNull('branchId')
                    .as('base');
            })
                .where('type', type);


        return toResult(Utility.kendoQueryResolve(query, parameters,
            item => ({id: item.id, title: item.title, readOnly: !item.branchId})));
    }
}