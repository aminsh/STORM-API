"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class JournalLineRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('journalLines')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = await(this.knexService('journalLines')
            .returning('id')
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knexService('journalLines')
            .where('id', id)
            .update(entity);
    }

    remove(id) {
        return this.knexService('journalLines')
            .where('id', id)
            .del();
    }
}

module.exports = JournalLineRepository;
