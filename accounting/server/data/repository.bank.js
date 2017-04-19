"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class BankRepository extends BaseRepository{
    constructor(branchId) {
        super(branchId);
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
            .insert(entity))[0];

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
