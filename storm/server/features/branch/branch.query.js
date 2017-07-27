"use strict";

const knex = require('../../services/knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = require('../../../../accounting/server/services/kendoQueryResolve');

class BranchQuery {
    constructor() {
        this.isActive = async(this.isActive);
    }

    getById(id) {
        return knex.select(
            'id', 'name', 'ownerName', 'logo',
            'apiKey', 'address', 'phone', 'mobile',
            'nationalCode', 'postalCode')
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
                    'id',
                    'name',
                    'logo',
                    'apiKey',
                    'status',
                    'address',
                    'phone',
                    'mobile',
                    'webSite',
                    'ownerName')
                    .from('branches')
                    .orderBy('createdAt', 'desc')
                    .as('base');
            }),

            view = item => ({
                id: item.id,
                name: item.name,
                logo: item.logo,
                apiKey: item.apiKey,
                status: item.status,
                address: item.address,
                phone: item.phone,
                mobile: item.mobile,
                webSite: item.webSite,
                ownerName: item.ownerName
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
}

module.exports = new BranchQuery();