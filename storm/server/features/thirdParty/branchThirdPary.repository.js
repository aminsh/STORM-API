"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class BranchThirdPartyRepository {
    constructor() {
        this.get = async(this.get);
    }

    create(branchId, key, data) {
        let json = JSON.stringify(data);

        return knex('branchThirdParty')
            .insert({key, data: json, branchId});
    }

    update(branchId, key, data) {
        let json = JSON.stringify(data);

        return knex('branchThirdParty')
            .where('key', key)
            .where('branchId', branchId)
            .update({data: json});
    }

    remove(branchId, key) {
        return knex('branchThirdParty')
            .where('key', key)
            .where('branchId', branchId)
            .del();
    }

    get (branchId, key) {
        return knex.from('branchThirdParty')
            .where('key', key)
            .where('branchId', branchId)
            .first()
    }
};