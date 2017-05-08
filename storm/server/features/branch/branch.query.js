"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class BranchQuery {
    constructor() {

    }

    getById(id) {
        return knex.select('id', 'name', 'logo', 'accConnection')
            .from('branches')
            .where('id', id).first();
    }

    getAll() {
        return knex.select('id', 'name', 'logo', 'accConnection').from('branches');
    }

    getBranchesByUser(userId) {
        let branch = await(knex.select('id', 'name', 'logo', 'accConnection')
            .from('branches')
            .where('ownerId', userId)),
        members = await(knex.select('*')
            .from('userInBranches')
            .where('userId', userId));

        return branch.concat(members);
    }
}

module.exports = new BranchQuery();