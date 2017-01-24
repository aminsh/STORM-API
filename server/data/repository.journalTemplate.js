"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await');

class JournalTemplateRepository {
    constructor(knex) {
        this.knex = knex;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('journalTemplates')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = await(this.knex('journalTemplates')
            .returning('id')
            .insert(entity));

        return entity;
    }

    remove(id) {
        return this.knex('journalTemplates')
            .where('id', id)
            .del();
    }
}

module.exports = JournalTemplateRepository;

