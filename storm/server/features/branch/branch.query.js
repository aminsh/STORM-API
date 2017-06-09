"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class BranchQuery {
    constructor() {

    }

    getById(id) {
        return knex.select('id', 'name', 'logo', 'apiKey')
            .from('branches')
            .where('id', id).first();
    }

    getAll() {
        return knex.select('id', 'name', 'logo', 'apiKey').from('branches');
    }

    getBranchesByUser(userId) {
        let branch = await(knex.select('id', 'name', 'logo', 'apiKey', 'status')
                .from('branches')
                .where('ownerId', userId)
                .andWhere('status', 'active')),
            branchIds = await(knex.select('branchId')
                .from('userInBranches')
                .where('userId', userId)).asEnumerable().select(b => b.branchId).toArray(),
            branches = await(knex.select('id', 'name', 'logo', 'apiKey', 'status')
                .from('branches')
                .where('status', 'active')
                .whereIn('id', branchIds));

        return branch.concat(branches);
    }
}

module.exports = new BranchQuery();