import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";

export class ScaleQuery extends BaseQuery {

    getAll(parameters) {
        let query = this.knex.select()
            .from('scales')
            .where('branchId', this.branchId);

        return toResult(Utility.kendoQueryResolve(query, parameters,
            item => ({id: item.id, title: item.title})));
    }

    getById(id) {
        let result = toResult(
            this.knex.select('*').from('scales').where({id}).first()
        );

        if(!result)
            throw new NotFoundException();

        return {id: result.id, title: result.title};
    }
}
