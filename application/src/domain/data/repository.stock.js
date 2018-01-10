import {BaseRepository} from "./repository.base";
import aw from "asyncawait/await";
import {injectable} from "inversify";

@injectable()
export class StockRepository extends BaseRepository {

    findById(id) {
        return aw(this.knex
            .table('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    isUsedOnInventory(id) {
        return aw(this.knex.select('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('stockId', id)
            .first());
    }

    getDefaultStock() {
        return aw(this.knex
            .table('stocks')
            .modify(this.modify, this.branchId)
            .first());
    }

    create(entity) {
        super.create(entity);
        return aw(this.knex('stocks').insert(entity));
    }

    update(id, entity) {
        return aw(this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity));
    }

    remove(id) {
        return aw(this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}

