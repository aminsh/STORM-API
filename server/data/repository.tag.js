"use strict"

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class TagRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('tags').where('id', id).first();
    }

    create(entity) {
        return this.knex('tags').insert(entity);
    }

    update(entity) {
        return this.knex('tags').where('id', entity.id).update(entity);
    }

    remove(id) {
        return this.knex('tags').where('id', id).del();
    }
};