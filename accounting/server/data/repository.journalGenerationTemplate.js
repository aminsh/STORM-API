"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');


class JournalGenerationTemplate extends BaseRepository {

    constructor(branchId) {
        super(branchId);
        this.tableName = 'journalGenerationTemplates'
    }

    findBySourceType(sourceType) {
        return await(this.knex.select('*')
            .from(this.tableName)
            .where('branchId', this.branchId)
            .where('sourceType', sourceType)
            .first());
    }

    create(sourceType, entity) {
        super.create(entity);

        entity.sourceType = sourceType;

        return this.knex(this.tableName).insert(entity);
    }

    update(sourceType, entity) {
        entity.sourceType = sourceType;

        return this.knex(this.tableName)
            .where('branchId', this.branchId)
            .where('sourceType', sourceType).update(entity);
    }

    remove(id) {
        return this.knex(this.tableName).where('id', id).del();
    }
}

module.exports = JournalGenerationTemplate;