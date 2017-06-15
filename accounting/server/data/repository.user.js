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
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    create(entity) {
        return this.knex('users').insert(entity);
    }
}

module.exports = UserRepository;