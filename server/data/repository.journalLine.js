"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class JournalLineRepository {
    constructor(knex) {
        this.knex = knex;
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
            .insert(entity));

        return entity;
    }

    update(entity) {
        return this.knex('journalLines')
            .where('id', id)
            .update(entity);
    }

    remove(id) {
        return this.knex('journalLines')
            .where('id', id)
            .del();
    }
}

module.exports = JournalLineRepository;
