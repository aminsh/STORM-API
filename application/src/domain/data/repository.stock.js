import {BaseRepository} from "./repository.base";
import toResult from "asyncawait/await";
import {injectable} from "inversify";

@injectable()
export class StockRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex
            .from('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    isUsedOnInventory(id) {
        return toResult(this.knex.select('id')
            .from('inventories')
            .modify(this.modify, this.branchId)
            .where('stockId', id)
            .first());
    }

    getDefaultStock() {
        return toResult(this.knex
            .from('stocks')
            .modify(this.modify, this.branchId)
            .first());
    }

    create(entity) {
        super.create(entity);
        return toResult(this.knex('stocks')
            .transacting(this.transaction)
            .insert(entity));
    }

    update(id, entity) {
        return toResult(this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .update(entity));
    }

    remove(id) {
        return toResult(this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del());
    }
}

