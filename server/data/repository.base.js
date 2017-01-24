"use strict";

module.exports = class RepositoryBase {
    constructor(knex) {
        this.knex = knex;
    }
};
