"use strict";

const knex = require('../services/knex'),
    await = require('asyncawait/await');

class BaseQuery {
    constructor(branchId, userId) {
        this.knex = knex;
        this.branchId = branchId;
        this.userId = userId;
        this.await = await;

        this.canView = function () {
            let isOwner = await(this.knex.select('isOwner')
                    .from('userInBranches')
                    .where('userId', userId)
                    .where('branchId', branchId)
                    .first())
                    .isOwner,
                isAdmin = await(this.knex.select('roles.isAdmin')
                    .from('userInRole')
                    .innerJoin('roles','roles.id','userInRole.roleId')
                    .where('userInRole.userId', userId)
                    .where('userInRole.branchId', branchId));

            isAdmin = isAdmin.length > 0 ? isAdmin[0].isAdmin : false;

            isOwner = isOwner || false;
            return isOwner || isAdmin;
        }
    }

    modify(queryBuilder, branchId, userId, isOwner, fieldName) {
        queryBuilder.where((fieldName && knex.raw(`"${fieldName}"."branchId"`)) || 'branchId', branchId);
        isOwner !== true && queryBuilder.where((fieldName && knex.raw(`"${fieldName}"."createdById"`)) || 'createdById', userId);
    }
}

module.exports = BaseQuery;