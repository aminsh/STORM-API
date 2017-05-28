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
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    create(entity) {
        super.create(entity);

        entity.id = await(this.knex('journalTemplates')
            .returning('id')
            .insert(entity))[0];

        return entity;
    }

    remove(id) {
        return this.knex('journalTemplates')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }
}

module.exports = JournalTemplateRepository;

