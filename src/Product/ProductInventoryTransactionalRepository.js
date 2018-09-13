import toResult from "asyncawait/await";
import {BaseRepository} from "../Infrastructure/BaseRepository";
import {injectable} from "inversify";

@injectable()
export class ProductInventoryTransactionalRepository extends BaseRepository {

    trx = undefined;

    tableName = "products_inventory";

    start() {

        this.trx = this.transaction;
    }

    commit() {
        toResult(this.trx.commit());
    }

    rollback() {

        toResult(this.trx.rollback());
    }

    findOneByProductAndStock(productId, stockId) {

        const fiscalPeriodId = this.state.fiscalPeriodId;

        return toResult(
            this.knex(this.tableName).transacting(this.trx).forUpdate()
                .select('*')
                .where('branchId', this.branchId)
                .where({productId, stockId, fiscalPeriodId})
                .first()
        );
    }

    create(entity) {
        entity.branchId = this.branchId;
        entity.fiscalPeriodId = this.state.fiscalPeriodId;

        toResult(this.knex(this.tableName).insert(entity));
    }

    update(id, entity) {

        toResult(this.trx(this.tableName).where({id}).update(entity));
    }
}