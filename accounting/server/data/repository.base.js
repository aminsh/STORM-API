"use strict";

const knex = instanceOf('knex'),
    Guid = instanceOf('utility').Guid;

module.exports = class RepositoryBase {
    constructor(branchId) {
        this.knex = knex;
        this.branchId = branchId;
    }

    create(entity) {
        entity.id = Guid.new();
        entity.branchId = this.branchId;
    }

    modify(queryBuilder, branchId){
        queryBuilder.where('branchId', branchId);
    }
};
