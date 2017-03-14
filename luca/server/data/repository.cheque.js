"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class ChequeRepository extends  BaseRepository{
    constructor(branchId) {
        super(branchId);
    }

    findById(id) {
        return this.knex.table('cheques')
            .where('id', id)
            .first();
    }

    update(entity) {
        return this.knex('cheques')
            .where('id', entity.id)
            .update(entity);
    }
}

module.exports = ChequeRepository;
