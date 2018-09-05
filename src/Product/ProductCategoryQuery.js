import {BaseQuery} from "../Infrastructure/BaseQuery";
import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";

@injectable()
export class ProductCategoryQuery extends BaseQuery {

    @inject("Enums") enums = undefined;

    getAll(parameters) {
        let query = this.knex.select()
            .from('productCategories')
            .where('branchId', this.branchId);
        return toResult(Utility.kendoQueryResolve(query, parameters, this.view.bind(this)));
    }

    getById(id) {
        let result = toResult(
            this.knex.select()
                .from('productCategories')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first()
        );

        return this.view(result);
    }

    view(entity) {
        return {
            id: entity.id,
            title: entity.title
        }
    }
}
