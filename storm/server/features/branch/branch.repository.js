"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid;

class BranchRepository {

    create(branch) {
        if (!branch.id)
            branch.id = Guid.new();

        return knex('branches').insert(branch);
    }

    update(id, branch) {
        return knex('branches').where('id', id).update(branch);
    }

    remove(id) {
        return knex('branches').where('id', id).del();
    }

    getById(id) {
        return knex.select('branches.*',
            knex.raw('users.email as "ownerEmail"'),
            knex.raw('users.name as "ownerName"'))
            .from('branches')
            .leftJoin('users', 'branches.ownerId', 'users.id')
            .where('branches.id', id)
            .first();
    }

    getMember(memberId) {
        return knex.table('userInBranches').where('id', memberId).first();
    }

    addMember(id, userId) {
        let member = {
            branchId: id,
            userId: userId,
            app: 'accounting',
            state: 'active'
        };

        return knex('userInBranches').insert(member);
    }

    updateMember(memberId, member) {
        return knex('userInBranches').where('id', memberId).update(member);
    }

    getBranchId(userId) {
        return knex('userInBranches').where('userId', userId).first();
    }

    // [START] SMRSAN
    getBranchMembers(branchId){
        return knex
            .select('users.email', 'users.name', 'users.image')
            .from('users')
            .leftJoin('userInBranches', 'users.id', 'userInBranches.userId')
            .where('userInBranches.branchId', branchId);
    }
    getUserInBranch(branchId, userId){
        return knex
            .select("*")
            .from("userInBranches")
            .where("branchId", branchId)
            .andWhere("userId", userId)
            .first();
    }
    deleteUserInBranch(branchId, userId){
        return knex("userInBranches")
            .where("branchId", branchId)
            .andWhere("userId", userId)
            .del();
    }
    // [-END-] SMRSAN

}

module.exports = new BranchRepository();