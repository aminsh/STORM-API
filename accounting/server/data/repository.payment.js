"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class PaymentRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    create(entity, trx) {
        if (Array.isArray(entity))
            entity.forEach(e => super.create(e));
        else
            super.create(entity);

        let query = this.knex.table('payments');

        if (trx)
            query.transacting(trx);

        return query.insert(entity);
    }
};