"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Guid = require('../../services/shared').utility.Guid;

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

    getMemeber(memberId) {
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
}

module.exports = new BranchRepository();