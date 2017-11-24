"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class FiscalPeriodRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return await(this.knex.table('fiscalPeriods')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first());
    }

    create(entity) {
        super.create(entity);
        await(this.knex('fiscalPeriods').insert(entity));
    }
}

module.exports = FiscalPeriodRepository;
