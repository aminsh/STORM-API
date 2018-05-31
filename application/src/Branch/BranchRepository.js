import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex'),
    TokenGenerator = instanceOf('TokenGenerator');

@injectable()
export class BranchRepository {

    tableName = "branches";

    findById(id) {
        return toResult(knex.select('*').from(this.tableName).where({id}).first());
    }

    update(id, data){
        return toResult(knex(this.tableName).where({id}).update(data));
    }
}