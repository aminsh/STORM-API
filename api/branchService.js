"use strict";

const knex = instanceOf('knex'),
    Crypto = instanceOf('Crypto'),
    await = require('asyncawait/await');

module.exports = {
    findByToken(token){
        let userInBranch = await(knex.select('userId', 'branchId')
            .from('userInBranches')
            .where('token', token)
            .first());

        if (userInBranch) {
            let branch = await(knex.select('branches.*',
                knex.raw('users.email as "ownerEmail"'),
                knex.raw('users.name as "ownerName"'))
                .from('branches')
                .leftJoin('users', 'branches.ownerId', 'users.id')
                .where('branches.id', userInBranch.branchId)
                .first());

            return {
                userId: userInBranch.userId,
                branchId: userInBranch.branchId,
                isActive: branch.status === 'active'
            };
        }

        try {
            userInBranch = Crypto.verify(token);

            if (userInBranch) {
                let branch = await(knex.select('branches.*',
                    knex.raw('users.email as "ownerEmail"'),
                    knex.raw('users.name as "ownerName"'))
                    .from('branches')
                    .leftJoin('users', 'branches.ownerId', 'users.id')
                    .where('branches.id', userInBranch.branchId)
                    .first());
                return {
                    userId: userInBranch.userId,
                    branchId: userInBranch.branchId,
                    isActive: branch.status === 'active'
                };
            }
        }
        catch (e) {

        }
    }
};