"use strict";

const Base = require('./base');

class SubsidiaryLedgerAccount extends Base {
    constructor(model, generalLedgerAccountId) {
        super();

        this.generalLedgerAccountId = generalLedgerAccountId;
        this.code = model.code2;
        this.title = model.title;
        this.description = '';
        this.isBankAccount = model.chq;
        this.hasDetailAccount = !!model.det;
        this.hasDimension1 = !!model.cen;
        this.hasDimension2 = !!model.code5;
        this.hasDimension3 = !!model.code6;
        this.isActive = true;
    }
}

module.exports = SubsidiaryLedgerAccount;