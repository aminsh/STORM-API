import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class BranchSubscriptionRepository {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    tableName = "branch_subscriptions";

    create(data) {
        const knex = this.dbContext.instance;

        return toResult(knex(this.tableName).insert(data));
    }

    getLast(branchId) {
        const knex = this.dbContext.instance;

        return toResult(
            knex.select('*').from(this.tableName)
                .where({branchId})
                .orderBy('id', 'desc')
                .first()
        );
    }
}