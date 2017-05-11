"use strict";

const knexFactory = require('../services/knex');

module.exports = class RepositoryBase {
    constructor(branchId) {
        this.knex = knexFactory(branchId);
        this.branchId = branchId;
    }
};
