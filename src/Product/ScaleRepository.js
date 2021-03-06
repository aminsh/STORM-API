import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class ScaleRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.table('scales')
            .modify(this.modify, this.branchId)
            .where('id', id).first());
    }

    create(entity) {
        super.create(entity);
        toResult(this.knex('scales')
            .insert(entity));
    }

    update(id, entity) {
        toResult(this.knex('scales')
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        toResult(this.knex('scales')
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }

}