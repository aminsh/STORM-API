import aw from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class PaymentRepository extends BaseRepository {

    findById(id) {
        return aw(this.knex.select('*').table('payments')
            .where('branchId', this.branchId)
            .andWhere('id', id)
            .first());
    }

    getBySumAmountByInvoiceId(invoiceId) {
        return aw(this.knex.table('payments')
            .where('branchId', this.branchId)
            .andWhere('invoiceId', invoiceId)
            .sum('amount')
            .first());
    }

    create(entity, trx) {
        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        let query = this.knex.table('payments');

        if (trx)
            query.transacting(trx);

        aw(query.insert(entity));

        return entity;
    }

    update(id, entity) {
        aw(this.knex('payments').where('id', id).update(entity));
    }
}