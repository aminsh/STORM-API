"use strict";

const dbConfig = require('../config').db,
    knex = require('knex')(dbConfig);

module.exports = knex;

