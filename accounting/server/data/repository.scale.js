"use strict"

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class ScaleRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('scales')
            .modify(this.modify, this.branchId)
            .where('id', id).first();
    }

    create(entity) {
        super.create(entity);
        return this.knex('scales').insert(entity);
    }

};