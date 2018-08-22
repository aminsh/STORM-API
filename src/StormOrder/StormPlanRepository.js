import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class StormPlanRepository {

    tableName = "storm_plans";

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    findById(id) {

        const knex = this.dbContext.instance;

        return toResult(
            knex.select('*').from(this.tableName).where({id}).first()
        );
    }
}