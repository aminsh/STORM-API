"use strict";

const Base = require('./base');

class SubsidiaryLedgerAccount extends Base {
    constructor(model, generalLedgerAccountId) {
        super();

        this.generalLedgerAccountId = generalLedgerAccountId;
        this.code = model.code2;
        this.description = '';
        this.isBankAccount = model.chq;
        this.detailAccountAssignmentStatus = model.det ? 'Required' : 'DoesNotHave';
        this.dimension1AssignmentStatus = model.cen ? 'Required' : 'DoesNotHave';
        this.dimension2AssignmentStatus = model.code5 ? 'Required' : 'DoesNotHave';
        this.dimension3AssignmentStatus = model.code6 ? 'Required' : 'DoesNotHave';
        this.isActive = true;
    }
}

module.exports = SubsidiaryLedgerAccount;