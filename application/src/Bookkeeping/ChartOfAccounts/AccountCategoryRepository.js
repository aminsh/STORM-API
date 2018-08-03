import toResult from "asyncawait/await";
import {BaseRepository} from "../../core/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class AccountCategoryRepository extends BaseRepository {

    tableName = 'accountCategories';

    findById(id) {
        return toResult(
            this.knex.from(this.tableName).where({id}).first()
        );
    }

    findByCode(code, notEqualId) {
        let query = this.knex.table(this.tableName)
            .modify(this.modify, this.branchId)
            .where('key', code);

        if (notEqualId)
            query.andWhere('id', '!=', notEqualId);

        return toResult(query.first());
    }

    create(entity) {
        entity.branchId = this.branchId;

        toResult(this.knex(this.tableName).insert(entity));
    }

    update(id, entity) {
        toResult(this.knex(this.tableName).where({id}).update(entity));
    }

    remove(id) {
        toResult(this.knex(this.tableName).where({id}).del());
    }
}