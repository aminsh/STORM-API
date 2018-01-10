import aw from "asyncawait/await";
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
        aw(this.knex('productCategories').insert(entity));
    }

    update(id, entity) {
        aw(this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        aw(this.knex('productCategories')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }
}
