"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = instanceOf('kendoQueryResolve');

class BranchQuery {
    constructor() {
        this.isActive = async(this.isActive);
    }

    getById(id) {
        return knex.select(
            'id', 'name', 'ownerName', 'logo',
            'apiKey', 'address', 'phone', 'mobile',
            'nationalCode', 'postalCode', 'fax', 'registrationNumber', 'province', 'city')
            .from('branches')
            .where('id', id).first();
    }

    isActive(id) {
        let branch = await(knex.select('status')
            .from('branches')
            .where('id', id)
            .first());
        return branch.status == 'active';
    }

    getAll(parameters) {
        let query = knex.from(function () {
                this.select(
                    'branches.id',
                    'branches.name',
                    knex.raw("branches.name || ' ' || branches.id as display"),
                    'logo',
                    'apiKey',
                    'status',
                    'address',
                    'phone',
                    'mobile',
                    'webSite',
                    'ownerName',
                    'ownerId',
                    'fax',
                    'registrationNumber',
                    'province',
                    'city',
                    knex.raw(`age(branches."createdAt") as "branchActiveTime"`),
                    knex.raw('users.name as "userTitle"'),
                    knex.raw('users.email as "userEmail"'))
                    .from('branches')
                    .leftJoin('users', 'branches.ownerId', 'users.id')
                    .orderBy('branches.createdAt', 'desc')
                    .as('base');
            }),

            view = item => ({
                id: item.id,
                name: item.name,
                display: item.display,
                logo: item.logo,
                apiKey: item.apiKey,
                status: item.status,
                address: item.address,
                phone: item.phone,
                mobile: item.mobile,
                fax: item.fax,
                webSite: item.webSite,
                ownerName: item.ownerName,
                owner: {
                    id: item.ownerId,
                    name: item.userTitle,
                    email: item.userEmail
                },
                registrationNumber: item.registrationNumber,
                province: item.province,
                city: item.city,
                branchActiveTimeDays: item.branchActiveTime.days,
                branchActiveTimeMonths: item.branchActiveTime.months || 0
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getBranchesByUser(userId) {
        let userInBranchQuery = knex.select('branchId')
            .from('userInBranches')
            .where('userId', userId);

        return knex.select('id', 'name', 'logo', 'apiKey', 'status', 'address', 'phone', 'mobile', 'webSite', 'ownerName')
            .from('branches')
            .where('ownerId', userId)
            .orWhereIn('id', userInBranchQuery);
    }

    totalBranches(){
        return knex.from('branches').count('*').first();
    }

    isSubscriptionExpired(branchId){
        let record = await(knex.select('*').from('orders').where('branchId', branchId).first());
        let expireTime = record.expire_at.getTime();
        let todayTime = new Date().getTime();

        if(expireTime < todayTime)
            return true;
        return false;
    }
}

module.exports = new BranchQuery();