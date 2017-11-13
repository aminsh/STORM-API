"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class PaymentRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return await(this.knex.select('*').table('payments')
            .where('branchId', this.branchId)
            .andWhere('id', id)
            .first());
    }

    getBySumAmountByInvoiceId(invoiceId) {
        return await(this.knex.table('payments')
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

        await(query.insert(entity));

        return entity;
    }

    update(id, entity) {
        await(this.knex('payments').where('id', id).update(entity)());
    }
};

module.exports = PaymentRepository;