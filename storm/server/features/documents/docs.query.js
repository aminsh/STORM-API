"use strict";

const knex = instanceOf("knex"),
      async = require("asyncawait/async"),
      await = require("asyncawait/await");

module.exports = class{

    constructor(){ }

    getParentList(){
        return knex('documentPages')
                .select('id', 'title')
                .whereNull('parentId');
    }

};