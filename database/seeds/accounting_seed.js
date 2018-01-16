"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    TokenGenerator = require('../../shared/services/token.generator'),
    tokenGenerator = new TokenGenerator();

exports.seed = async(function (knex, Promise) {

    const branches = await(knex.select('*').from('branches'));

    let data = branches.map(item => ({
        branchId: item.id,
        userId: item.ownerId,
        app: 'accounting',
        state: 'active',
        isOwner: true,
        token: tokenGenerator.generate256Bit()
    }));

    return knex.table('userInBranches').insert(data);

    const userInBranchesTokenIsNull = await(knex.select('id').from("userInBranches").whereNull('token'));

    userInBranchesTokenIsNull.forEach(e => await(knex("userInBranches").where('id', e.id).update({token: tokenGenerator.generate256Bit()})));


});