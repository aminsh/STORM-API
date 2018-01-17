"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = instanceOf('utility').Guid,
    /**
     * @type {TokenGenerator} */
    TokenGenerator = instanceOf('TokenGenerator'),
    kendoQueryResolve = instanceOf('kendoQueryResolve');

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
        return await(knex.select('branches.*',
            knex.raw('users.email as "ownerEmail"'),
            knex.raw('users.name as "ownerName"'))
            .from('branches')
            .leftJoin('users', 'branches.ownerId', 'users.id')
            .where('branches.id', id)
            .first());
    }

    findByToken(token) {
        return await(knex.select('userId', 'branchId')
            .from('userInBranches')
            .where('token', token)
            .first());
    }

    getMember(memberId) {
        return await(knex.table('userInBranches').where('id', memberId).first());
    }

    addMember(id, userId, isOwner) {
        let member = {
            branchId: id,
            userId: userId,
            app: 'accounting',
            state: 'active',
            isOwner,
            token: TokenGenerator.generate256Bit()
        };

        return knex('userInBranches').insert(member);
    }

    getMemberByIdAndUserId(id, userId){
        return await(knex('userInBranches')
            .where('branchId', id)
            .where('userId', userId)
            .first())
    }

    updateMember(memberId, member) {
        return await(knex('userInBranches').where('id', memberId).update(member));
    }

    getBranchId(userId) {
        return knex('userInBranches').where('userId', userId).first();
    }

    getBranchMembers(branchId, parameters) {
        let query = knex.from(function () {
            this.select(
                knex.raw('users.id as "userId"'),
                'users.email',
                'users.name',
                'users.image',
                'userInBranches.token',
                'userInBranches.id',
                'userInBranches.isOwner')
                .from('users')
                .leftJoin('userInBranches', 'users.id', 'userInBranches.userId')
                .where('userInBranches.branchId', branchId)
                .as('base');
        });

        return await(kendoQueryResolve(query, parameters, item => item));
    }

    getUserInBranch(branchId, userId) {
        return knex
            .select("*")
            .from("userInBranches")
            .where("branchId", branchId)
            .andWhere("userId", userId)
            .first();
    }

    deleteUserInBranch(branchId, userId) {
        return knex("userInBranches")
            .where("branchId", branchId)
            .andWhere("userId", userId)
            .del();
    }

    // [-END-] SMRSAN

}

module.exports = BranchRepository;