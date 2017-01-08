"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await');

class UserRepository {
    constructor(knexService) {
        this.knexService = knexService;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knexService.table('users')
            .where('id', id)
            .first();
    }

    create(entity) {
        entity.id = this.knexService('users')
            .returning('id')
            .insert(entity);

        return entity;
    }
}

module.exports = UserRepository;