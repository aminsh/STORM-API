import {injectable} from "inversify";
import toResult from "asyncawait/await";

const knex = instanceOf('knex');

@injectable()
export class LoggerRepository {

    tableName = "applicationLogger";

    create(data) {
        toResult(knex(this.tableName).insert(data));
    }

    update(id, data) {
        toResult(knex(this.tableName).where({id}).update(data));
    }
}