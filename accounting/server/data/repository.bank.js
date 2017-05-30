"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base'),
    Guid = require('../services/shared').utility.Guid;

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
        entity.id = Guid.new();
        return this.knex('banks').insert(entity);
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
