"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid;

class RepositoryBase {
    constructor(branchId) {
        this.knex = knex;
        this.branchId = branchId;
    }

    create(entity) {
        entity.id = Guid.new();
        entity.branchId = this.branchId;
    }

    modify(queryBuilder, branchId) {
        queryBuilder.where('branchId', branchId);
    }

    get transaction() {
        return new Promise(resolve => this.knex.transaction(trx => resolve(trx)));
    }
}

module.exports = RepositoryBase;
