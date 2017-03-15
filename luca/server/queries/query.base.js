"use strict";

const knexFactory = require('../services/knex');

class BaseQuery {
    constructor(branchId) {
        this.knex = knexFactory(branchId);
    }
}

module.exports = BaseQuery;