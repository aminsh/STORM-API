"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class {
    constructor() {

    }

    getAll(){
        return knex.select('id', 'name', 'email','image','state')
            .from('users');
    }

    getByEmail(email) {
        return knex.table('users')
            .where('email', 'ILIKE', email)
            .first();
    }
};