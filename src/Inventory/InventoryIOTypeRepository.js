import toResult from "asyncawait/await";
import { BaseRepository } from "../Infrastructure/BaseRepository";
import { injectable } from "inversify";

@injectable()
export class InventoryIOTypeRepository extends BaseRepository {

    tableName = 'inventoryIOTypes';

    findById(id) {
        return toResult(this.knex.table(this.tableName)
            .where('id', id).first());
    }

    isUsed(id) {
        return toResult(
            this.knex.select('id')
                .from('inventories')
                .where({ ioType: id })
                .first()
        );
    }

    isReadOnly(id) {
        return toResult(
            this.knex.select('id')
                .from(this.tableName)
                .where({ id })
                .whereNotNull('key')
                .first()
        );
    }

    create(entity) {
        super.create(entity);
        toResult(this.knex(this.tableName)
            .insert(entity));
    }

    update(id, entity) {
        toResult(this.knex(this.tableName)
            .modify(this.modify, this.branchId)
            .where('id', id).update(entity));
    }

    remove(id) {
        toResult(this.knex(this.tableName)
            .modify(this.modify, this.branchId)
            .where('id', id).del());
    }

}