import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    TokenGenerator = instanceOf('TokenGenerator');

@injectable()
export class StormGiftRepository {

    tableName = "storm_gifts";

    findById(id) {
        return toResult(
            knex.select('*').from(this.tableName).where({id}).first()
        );
    }
}