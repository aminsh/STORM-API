"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class UserRepository {
    constructor(knex) {
        this.knex = knex;
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