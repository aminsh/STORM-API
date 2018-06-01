import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    TokenGenerator = instanceOf('TokenGenerator');

@injectable()
export class StormOrderRepository {

    tableName = "storm_orders";

    findById(id) {

        let order =  toResult(knex.select('*').from(this.tableName).where({id}).first()),
            plan = toResult(knex.select('*').from('storm_plans').where({id: order.planId}).first());

        order.plan = plan;

        return order;
    }

    findMaxNumber() {
        let result = toResult(
            knex.select('number').from(this.tableName).orderBy('number', 'desc').first()
        );

        return result ? parseInt(result.number) : 0;
    }

    isUsedGift(giftId, userId) {
        return toResult(
            knex.select('giftId').from('storm_orders')
                .leftJoin('branches', 'storm_orders.branchId', 'branches.id')
                .where('giftId', giftId)
                .where('ownerId', userId)
                .first()
        );
    }

    create(entity) {

        entity.id = TokenGenerator.generate128Bit();

        toResult(knex(this.tableName).insert(entity));
    }

    update(id, entity) {
        toResult(knex(this.tableName).where({id}).update(entity));
    }

}