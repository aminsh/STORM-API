import {injectable, inject} from "inversify";
import toResult from "asyncawait/await";

@injectable()
export class LoggerRepository {

    @inject("DbContext")
    /**@type{DbContext}*/ dbContext = undefined;

    tableName = "applicationLogger";

    create(data) {
        const knex = this.dbContext.instance;

        toResult(knex(this.tableName).insert(data));
    }

    update(id, data) {
        const knex = this.dbContext.instance;

        toResult(knex(this.tableName).where({id}).update(data));
    }
}