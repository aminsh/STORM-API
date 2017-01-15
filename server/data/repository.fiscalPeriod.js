"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class FiscalPeriodRepository {
    constructor(knex) {
        this.knex = knex;
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
            .insert(entity));

        return entity;
    }
}

module.exports = FiscalPeriodRepository;
