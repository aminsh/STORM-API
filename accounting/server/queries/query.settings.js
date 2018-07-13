"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base');

class SettingQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    get() {
        return await(this.knex.select(
            'vat',
            'tax',
            'bankId',
            'canControlInventory',
            'canCreateSaleOnNoEnoughInventory',
            'canSaleGenerateAutomaticJournal',
            'productOutputCreationMethod',
            'stockId',
            'stakeholders',
            'subsidiaryLedgerAccounts',
            'saleCosts',
            'saleCharges',
            'webhooks',
            'invoiceDescription')
            .from('settings')
            .where('branchId', this.branchId)
            .first());
    }
}

module.exports = SettingQuery;