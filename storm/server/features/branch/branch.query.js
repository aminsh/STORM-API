"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class {
    constructor() {

    }

    getById(id){
        return knex.select('id', 'name', 'logo').from('branches').where('id', id).first();
    }

    getAll(){
        return knex.select('id', 'name', 'logo', 'lucaConnectionId').from('branches');
    }
};