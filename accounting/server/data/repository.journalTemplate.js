"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class JournalTemplateRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
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
            .insert(entity))[0];

        return entity;
    }

    remove(id) {
        return this.knex('journalTemplates')
            .where('id', id)
            .del();
    }
}

module.exports = JournalTemplateRepository;

