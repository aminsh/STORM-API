"use strict";

let ModelBase = require('../utilities/modelBase'),
    Journal require('./journal'),
    GeneralLedgerAccount = require('./generalLedgerAccount'),
    SubsidiaryLedgerAccount = require('./subsidiaryLedgerAccount'),
    DetailAccount = require('./detailAccount'),
    Dimension = require('./dimension');


class JournalLine extends ModelBase {
    get row() {
        return 'INTEGER';
    }

    get debtor() {
        return 'DOUBLE';
    }

    get creditor() {
        return 'DOUBLE'
    }
    get article() {
        return 'STRING'
    }

    get dimension1() {
        return Dimension;
    }

    get dimension2() {
        return Dimension;
    }

    get dimension3() {
        return Dimension
    };
}

module.exports = JournalLine;
