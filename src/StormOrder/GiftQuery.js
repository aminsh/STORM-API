import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class GiftQuery {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    tableName = "storm_gifts";

    find(where, single) {
        const knex = this.dbContext.instance;

        let query = knex.select('*').from(this.tableName);

        if (where)
            query.where(where);

        if (single)
            query.first();

        return toResult(query);
    }

    isUsed(id, userId) {
        const knex = this.dbContext.instance;

        return toResult(
            knex.select('giftId').from('storm_orders')
                .leftJoin('branches', 'storm_orders.branchId', 'branches.id')
                .where('giftId', id)
                .where('ownerId', userId)
                .first()
        );
    }
}