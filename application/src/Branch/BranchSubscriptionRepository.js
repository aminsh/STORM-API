import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    TokenGenerator = instanceOf('TokenGenerator');

@injectable()
export class BranchSubscriptionRepository {

    tableName = "branch_subscriptions";

    create(data) {
        return toResult(knex(this.tableName).insert(data));
    }

    getLast(branchId){
        return toResult(
            knex.select('*').from(this.tableName)
                .where({branchId})
                .orderBy('id', 'desc')
                .first()
        );
    }
}