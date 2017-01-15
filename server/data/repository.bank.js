"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await');

class BankRepository {
    constructor(knex) {
        this.knex = knex;
        this.create = async(this.create);
    }

    findById(id) {
        return this.knex
            .table('banks')
            .where('id', id)
            .first();
    }

    create(entity) {
        let id = await(this.knex('banks')
            .returning('id')
            .insert(entity));

        entity.id = id;
        return entity;
    }

    update(entity) {
        return this.knex('banks')
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('banks')
            .where('id', id)
            .del();
    }
}


module.exports = BankRepository;
