import toResult from "asyncawait/await";
import {BaseRepository} from "./repository.base";
import {injectable} from "inversify";

@injectable()
export class PaymentRepository extends BaseRepository {

    findById(id) {
        return toResult(this.knex.select('*').table('payments')
            .modify(this.modify, this.branchId)
            .andWhere('id', id)
            .first());
    }

    getBySumAmountByInvoiceId(invoiceId) {
        return toResult(this.knex.table('payments')
            .modify(this.modify, this.branchId)
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

        toResult(query.insert(entity));

        return entity;
    }

    update(id, entity) {
        toResult(this.knex('payments').where('id', id)
            .modify(this.modify, this.branchId)
            .update(entity));
    }
}