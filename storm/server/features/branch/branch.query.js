"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = instanceOf('kendoQueryResolve'),
    PersianDate = instanceOf('utility').PersianDate;

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
                city: item.city
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getBranchesByUser(userId) {

        return await(knex.select(
            'branches.id',
            'name',
            'logo',
            'userInBranches.token',
            'userInBranches.isOwner',
            'status',
            'address',
            'phone',
            'mobile',
            'webSite',
            'ownerName',
            'branches.createdAt')
            .from('branches')
            .leftJoin("userInBranches", "branches.id", "userInBranches.branchId")
            .where('userInBranches.userId', userId)
            .map(item => ({
                id: item.id,
                name: item.name,
                isOwner: item.isOwner,
                logo: item.logo,
                token: item.token,
                statue: item.status,
                address: item.address,
                phone: item.phone,
                mobile: item.mobile,
                webSite: item.webSite,
                ownerName: item.ownerName,
                createdAt: item.createdAt,
                createdAtToPersian: PersianDate.getDate(item.createdAt)
            }))
        );
    }
    
    getBranchByToken(token){
        let result = await(knex.select(
            'branches.id',
            'name',
            'logo',
            'userInBranches.token',
            'userInBranches.isOwner',
            'status',
            'address',
            'phone',
            'mobile',
            'webSite',
            'ownerName',
            'branches.createdAt')
            .from('branches')
            .leftJoin("userInBranches", "branches.id", "userInBranches.branchId")
            .where('userInBranches.token', token)
            .first());
        
        if(!result)
            return;
        
        return {
            id: result.id,
            name: result.name,
            isOwner: result.isOwner,
            logo: result.logo,
            token: result.token,
            statue: result.status,
            address: result.address,
            phone: result.phone,
            mobile: result.mobile,
            webSite: result.webSite,
            ownerName: result.ownerName,
            createdAt: result.createdAt,
            createdAtToPersian: PersianDate.getDate(result.createdAt)
        };
    }


    totalBranches() {
        return knex.from('branches').count('*').first();
    }

    isSubscriptionExpired(branchId) {
        let record = await(knex.select('*').from('orders').where('branchId', branchId).first());
        let expireTime = record.expire_at.getTime();
        let todayTime = new Date().getTime();

        if (expireTime < todayTime)
            return true;
        return false;
    }
}

module.exports = new BranchQuery();