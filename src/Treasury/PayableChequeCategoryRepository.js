import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class PayableChequeCategoryRepository extends BaseRepository {

    tableName = 'chequeCategories';

    findById(id) {
        return toResult(this.knex.table(this.tableName)
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    findOne(criteria){
        return toResult(this.knex
            .select('*')
            .from(this.tableName)
            .modify(this.modify, this.branchId)
            .where(criteria)
            .orderBy('receiveDate')
            .first());
    }

    create(entity) {
        super.create(entity);

        toResult(this.knex(this.tableName).insert(entity));
    }

    update(id, entity) {
        toResult(this.knex(this.tableName)
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity));
    }

    remove(id) {
        toResult(
            this.knex(this.tableName)
                .modify(this.modify, this.branchId)
                .where('id', id)
                .del()
        );
    }
}



