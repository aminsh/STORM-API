"use strict";

let ModelBase = require('../utilities/bookshelf.ModelBase'),
    ChequeCategory = require('./chequeCategory'),
    JournalLine = require('./JournalLine'),
    enums = require('../constants/enums');

class Cheque extends ModelBase {

    get number() {
        return 'INTEGER';
    }

    get date() {
        return 'STRING';
    }

    get description() {
        return 'STRING';
    }

    get amount() {
        return 'DOUBLE';
    }

    get status() {
        return {
            type: 'ENUM',
            values: enums.ChequeStatus().getKeys()
        }
    }

    get journalLine() {
        return JournalLine;
    }

    get category() {
        return ChequeCategory;
    }
}

module.exports = Cheque;
