"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class ChequeRepository extends  BaseRepository{
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('cheques')
            .modify(this.modify, this.branchId)
            .where('id', id)
            .first();
    }

    update(entity) {
        return this.knex('cheques')
            .modify(this.modify, this.branchId)
            .where('id', entity.id)
            .update(entity);
    }
}

module.exports = ChequeRepository;
