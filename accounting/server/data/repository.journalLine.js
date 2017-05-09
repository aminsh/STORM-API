"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class JournalLineRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('journalLines')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = await(this.knex('journalLines')
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    update(entity) {
        return this.knex('journalLines')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('journalLines')
            .where('id', id)
            .del();
    }
}

module.exports = JournalLineRepository;
