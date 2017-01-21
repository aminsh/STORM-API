"use strict";

class BaseQuery{
    constructor(knex){
        this.knex = knex;
    }
}

module.exports = BaseQuery;