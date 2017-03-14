"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class UserRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex.table('users')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = this.knex('users')
            .returning('id')
            .insert(entity);

        return entity;
    }
}

module.exports = UserRepository;