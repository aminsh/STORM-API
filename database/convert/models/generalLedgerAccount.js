"use strict";

const Base = require('./base');

class GeneralLedgerAccount extends Base {
    constructor(model) {
        super();

        this.code = model.code1;
        this.title = model.title;
        this.description = '';
        this.balanceType = this.getBalanceType(model.LedgerSign);
        this.postingType = this.getPostingType(model.Grp1);
        this.isActive = true;
    }

    getBalanceType(value) {
        if (value == null || value == 0)
            return null;
        if (value == 1)
            return 'debit';
        if (value == -1)
            return 'credit'
    }

    getPostingType(value) {
        const types = {
            1: 'balanceSheet',
            2: 'benefitAndLoss',
            3: 'entezami'
        };

        return types[value];
    }
}

module.exports = GeneralLedgerAccount;