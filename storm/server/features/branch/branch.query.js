"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class {
    constructor() {

    }

    getById(id) {
        return knex.select('id', 'name', 'logo', 'accConnection').from('branches').where('id', id).first();
    }

    getAll() {
        return knex.select('id', 'name', 'logo', 'accConnection').from('branches');
    }
};