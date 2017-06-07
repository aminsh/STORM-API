"use strict";

const config = require('../config'),
    knex = require('knex')(config.db);

module.exports = knex;

