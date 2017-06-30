"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

module.exports = class SettingRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    create(entity) {
        super.create(entity);

        return this.knex('settings').insert(entity);
    }

    update(entity) {
        return this.knex('settings').where('branchId', this.branchId).update(entity);
    }

    get() {
        return this.knex.table('settings')
            .where('branchId', this.branchId)
            .first();
    }

};