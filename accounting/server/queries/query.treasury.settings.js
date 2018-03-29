"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base');

class TreasurySettingQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    get() {
        return await(this.knex.select(
            'subsidiaryLedgerAccounts')
            .from('treasurySettings')
            .where('branchId', this.branchId)
            .first());
    }
}

module.exports = TreasurySettingQuery;