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
            .table('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    getDefaultStock(){
        return this.knex
            .table('stocks')
            .modify(this.modify, this.branchId)
            .first();
    }

    create(entity) {
        super.create(entity);
        return this.knex('stocks').insert(entity);
    }

    update(entity) {
        return this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }

    remove(id) {
        return this.knex('stocks')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .del();
    }
}


module.exports = BankRepository;
