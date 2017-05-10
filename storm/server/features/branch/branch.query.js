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
            branchIds = await(knex.select('branchId')
                .from('userInBranches')
                .where('userId', userId)).asEnumerable().select(b => b.branchId).toArray(),
            branches = await(knex.select('id', 'name', 'logo', 'accConnection')
                .from('branches')
                .whereIn('id', branchIds));

        return branch.concat(branches);
    }
}

module.exports = new BranchQuery();