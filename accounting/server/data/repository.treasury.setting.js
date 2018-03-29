"use strict";

let async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseRepository = require('./repository.base');

class TreasurySettingRepository extends BaseRepository {
    constructor(branchId) {
        super(branchId);
        this.create = async(this.create);
    }

    create(entity) {
        super.create(entity);

        return this.knex('treasurySettings').insert(entity);
    }

    update(entity) {
        return await(this.knex('treasurySettings').where('branchId', this.branchId).update(entity));
    }

    get() {
        return await(this.knex.table('treasurySettings')
            .where('branchId', this.branchId)
            .first());
    }

}

module.exports = TreasurySettingRepository;