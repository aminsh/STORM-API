"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class JournalTemplateRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('journalTemplates')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = await(this.knexService('journalTemplates')
            .returning('id')
            .insert(entity));

        return entity;
    }

    remove(id) {
        return this.knexService('journalTemplates')
            .where('id', id)
            .del();
    }
}

module.exports = JournalTemplateRepository;

