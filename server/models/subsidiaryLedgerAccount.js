"use strict";

let ModelBase = require('../utilities/modelBase'),
    GeneralLedgerAccount = require('./generalLedgerAccount');

class SubsidiaryLedgerAccount extends ModelBase {
    get code() {
        return 'STRING';
    }

    get title() {
        return 'STRING';
    }

    get description() {
        return 'STRING';
    },
    get isBankAccount() {
        return 'BOOLEAN';
    }

    get detailAccountAssignmentStatus() {
        return {
            type: 'ENUM',
            values: enums.AssignmentStatus().getKeys()
        };
    }
    get dimension1AssignmentStatus() {
        return {
            type: 'ENUM',
            values: enums.AssignmentStatus().getKeys()
        };
    }

    get dimension2AssignmentStatus() {
        return {
            type: 'ENUM',
            values: enums.AssignmentStatus().getKeys()
        };
    }

    get dimension3AssignmentStatus() {
        return {
            type: 'ENUM',
            values: enums.AssignmentStatus().getKeys()
        };
    }

    get isActive() {
        return 'BOOLEAN';
    }
}

module.exports = SubsidiaryLedgerAccount;
