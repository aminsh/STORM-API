import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class ProductCategoryRepository extends BaseRepository {

    findById(id) {
        return this.knex.table('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    create(entity) {
        super.create(entity);
        toResult(this.knex('productCategories')
            .insert(entity));
    }

    update(id, entity) {
        toResult(this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        toResult(this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }
}
