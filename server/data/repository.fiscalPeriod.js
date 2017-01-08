"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class FiscalPeriodRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('fiscalPeriods')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = await(this.knexService('fiscalPeriods')
            .returning('id')
            .insert(entity));

        return entity;
    }
}

module.exports = FiscalPeriodRepository;
