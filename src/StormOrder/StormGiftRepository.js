import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class StormGiftRepository {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    tableName = "storm_gifts";

    findById(id) {

        const knex = this.dbContext.instance;

        return toResult(
            knex.select('*').from(this.tableName).where({id}).first()
        );
    }
}