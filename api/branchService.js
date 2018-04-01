"use strict";

const knex = instanceOf('knex'),
    Crypto = instanceOf('Crypto'),
    Memory = instanceOf('Memory'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class BranchService {

    findByToken(token) {

        let readFromMemory = Memory.get(`token:${token}-branch-member`);

        if (readFromMemory)
            return readFromMemory;

        let userInBranch = await(knex.select('userId', 'branchId')
            .from('userInBranches')
            .where('token', token)
            .first());

        if (userInBranch) {

            Memory.set(`token:${token}-branch-member`, userInBranch);

            return userInBranch;
        }

        try {
            userInBranch = Crypto.verify(token);

            if (userInBranch) {

                Memory.set(`token:${token}-branch-member`, userInBranch);

                return userInBranch;
            }
        }
        catch (e) {
            return;
        }
    }

    findById(id) {
        return await(knex.select('*').from('branches').where({id}).first());
    }

    isActive(id) {

        let readFromMemory = Memory.get(`branch:${id}-isActive`);

        if (readFromMemory)
            return readFromMemory.isActive;

        let branch = await(knex.select('status').from('branches').where({id}).first()),
            isActive = branch.status === 'active';

        Memory.set(`branch:${id}-isActive`, {isActive});

        return isActive;
    }
}

module.exports = BranchService;