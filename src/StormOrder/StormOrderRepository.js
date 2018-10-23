import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class StormOrderRepository {

    tableName = "storm_orders";

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    findById(id) {

        const knex = this.dbContext.instance;

        let order = toResult(knex.select('*').from(this.tableName).where({id}).first()),
            plan = toResult(knex.select('*').from('storm_plans').where({id: order.planId}).first());

        order.plan = plan;

        return order;
    }

    findMaxNumber() {

        const knex = this.dbContext.instance;

        let result = toResult(
            knex.select('number').from(this.tableName).orderBy('number', 'desc').first()
        );

        return result ? parseInt(result.number) : 0;
    }

    isUsedTrialBefore(userId) {

        const knex = this.dbContext.instance,

            user = toResult(knex.select('*').from('users').where({id: userId}).first()),

            query = knex.select('storm_plans.id')
                .from(this.tableName)
                .leftJoin('storm_plans', this.tableName + '.planId', 'storm_plans.id')
                .leftJoin('branches', this.tableName + '.branchId', 'branches.id')
                .leftJoin('users', `branches.ownerId`, 'users.id')
                .where('storm_plans.name', 'Trial');

        let where = '';

        if(user.email)
            where = `users.email ILIKE '${user.email}' `;

        if(user.mobile)
            where += `OR users.mobile = '${user.mobile}'`;

        if(where.length === 0)
            `users.id = '${user.id}'`;
        else
            where = `(${where})`;

        query.whereRaw(where);

        return !!toResult(query.first());
    }


    isUsedGift(giftId, userId) {

        const knex = this.dbContext.instance;

        return toResult(
            knex.select('giftId').from('storm_orders')
                .leftJoin('branches', 'storm_orders.branchId', 'branches.id')
                .where('giftId', giftId)
                .where('ownerId', userId)
                .first()
        );
    }

    create(entity) {
        const knex = this.dbContext.instance;

        entity.id = Utility.TokenGenerator.generate128Bit();

        toResult(knex(this.tableName).insert(entity));
    }

    update(id, entity) {
        const knex = this.dbContext.instance;

        toResult(knex(this.tableName).where({id}).update(entity));
    }

}