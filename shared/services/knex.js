"use strict";

const dbConfig = instanceOf('config').db,
    knex = require('knex')(dbConfig);

module.exports = knex;

