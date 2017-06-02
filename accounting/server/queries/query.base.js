"use strict";

const knex = require('../services/knex');

class BaseQuery {
    constructor(branchId) {
        this.knex = knex;
        this.branchId = branchId;
    }

    modify(queryBuilder, branchId){
        queryBuilder.where('branchId', branchId);
    }
}

module.exports = BaseQuery;