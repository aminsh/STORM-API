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
        return this.knex.table('fiscalPeriods')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = await(this.knex('fiscalPeriods')
            .returning('id')
            .insert(entity))[0];

        return entity;
    }
}

module.exports = FiscalPeriodRepository;
