"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class BranchQuery {
    constructor() {
        this.isActive = async(this.isActive);
    }

    getById(id) {
        return knex.select(
            'id', 'name', 'ownerName' , 'logo',
            'apiKey', 'address', 'phone', 'mobile',
            'nationalCode', 'postalCode')
            .from('branches')
            .where('id', id).first();
    }

    isActive(id){
        let branch = await(knex.select('status')
            .from('branches')
            .where('id', id)
            .first());
        return branch.status == 'active';
    }

    getAll() {
        return knex.select('id', 'name', 'logo', 'apiKey', 'status','address','phone','mobile','webSite','ownerName')
            .from('branches')
            .orderBy('createdAt', 'desc');
    }

    getBranchesByUser(userId) {
        let userInBranchQuery = knex.select('branchId')
            .from('userInBranches')
            .where('userId', userId);

        return knex.select('id', 'name', 'logo', 'apiKey', 'status','address','phone','mobile','webSite','ownerName')
                .from('branches')
                .where('ownerId', userId)
                .orWhereIn('id', userInBranchQuery);
    }
}

module.exports = new BranchQuery();