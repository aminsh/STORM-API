import toResult from "asyncawait/await";
import {BaseRepository} from "../../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class DetailAccountCategoryRepository extends BaseRepository {

    tableName = "detailAccountCategories";

    findById(id) {
        return toResult(
            this.knex.table(this.tableName)
                .modify(this.modify, this.branchId)
                .where('id', id)
                .first()
        );
    }

    create(entity) {
        super.create(entity);

        return toResult(this.knex(this.tableName).insert(entity));
    }

    update(id ,entity) {
        return toResult(
            this.knex(this.tableName)
                .modify(this.modify, this.branchId)
                .where('id', id)
                .update(entity)
        );
    }

    remove(id) {
        return toResult(
            this.knex(this.tableName)
                .modify(this.modify, this.branchId)
                .where('id', id)
                .del()
        );
    }
}