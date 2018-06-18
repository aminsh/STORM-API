import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex');

@injectable()
export class GiftQuery {

    tableName = "storm_gifts";

    find(where, single) {
        let query = knex.select('*').from(this.tableName);

        if (where)
            query.where(where);

        if (single)
            query.first();

        return toResult(query);
    }

    isUsed(id, userId) {
        return toResult(
            knex.select('giftId').from('storm_orders')
                .leftJoin('branches', 'storm_orders.branchId', 'branches.id')
                .where('giftId', id)
                .where('ownerId', userId)
                .first()
        );
    }
}