"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base');

class SettingQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    get() {
        return this.knex.select('vat', 'bankId', 'canControlInventory')
            .from('settings')
            .where('branchId', this.branchId)
            .first();
    }
}

module.exports = SettingQuery;