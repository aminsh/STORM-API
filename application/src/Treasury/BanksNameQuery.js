import {BaseQuery} from "../core/BaseQuery";
import toResult from "asyncawait/await";
import {injectable} from "inversify";

@injectable()
export class BanksNameQuery extends BaseQuery {

    tableName = "banksName";

    getAll(parameters) {

        let query = this.knex.from(this.tableName);

        return toResult(
            Utility.kendoQueryResolve(query, parameters, item => ({id: item.id, title: item.title}))
        );
    }

    getById(id) {

        const result = toResult(this.knex.from(this.tableName).where({id}).first());

        if (!result)
            throw new NotFoundException();

        return {
            id: result.id,
            title: result.title
        };
    }
}