import toResult from "asyncawait/await";
import { BaseRepository } from "../Infrastructure/BaseRepository";
import { injectable } from "inversify";

@injectable()
export class InvoiceTypeRepository extends BaseRepository {
    tableName = 'invoice_types';

    findById(id) {
        return toResult(
            this.knex.select('*').from(this.tableName)
                .where({ branchId: this.branchId, id }).first()
        );
    }

    findDefault() {
        return toResult(
            this.knex.select('*').from(this.tableName)
                .where({ branchId: this.branchId, isDefault: true }).first()
        );
    }

    findByReference(referenceId) {
        return toResult(
            this.knex.select('*').from(this.tableName)
                .where({ branchId: this.branchId, referenceId }).first()
        );
    }

    findOneOrGetDefault(type) {
        let entity;

        if(!type)
            return this.findDefault();

        if(type.id) {
            entity = this.findById(type.id);
            if(entity) return entity;
        }

        if(type.referenceId) {
            entity = this.findByReference(type.referenceId);
            if(entity) return entity;
        }

        return null;
    }

    create(entity) {
        super.create(entity);

        toResult(this.knex(this.tableName).insert(entity));
    }

    update(id, entity) {
        toResult(this.knex(this.tableName)
            .where({ branchId: this.branchId, id })
            .update(entity));
    }

    remove(id) {
        toResult(this.knex(this.tableName).where({branchId: this.branchId, id}).del());
    }

    setAllIsDefaultAsFalse() {
        toResult(
            this.knex(this.tableName).where({branchId: this.branchId}).update({isDefault: false})
        );
    }
}
