"use strict";

let ModelBase = require('../utilities/modelBase'),
    User = require('./user'),
    FiscalPeriod = require('./fiscalPeriod'),
    JournalLine = require('./journalLine'),
    Tag = require('./tag'),
    enums = require('../constants/enums');

class Journal extends ModelBase {
    get temporaryNumber() {
        return 'INTEGER';
    }

    get temporaryDate() {
        return 'STRING';
    }

    get number() {
        return 'INTEGER';
    }

    get date() {
        return 'STRING';
    }

    get description() {
        return 'STRING';
    }

    get journalStatus() {
        return {
            type: 'ENUM',
            values: enums.JournalStatus().getKeys()
        };
    }

    get isInComplete() {
        return 'BOOLEAN';
    }

    get journalreturn {
        return {
            type: 'ENUM',
            values: enums.JournalType().getKeys()
        };
    }

    get attachmentFileName() {
        return 'STRING';
    }

    get createdBy() {
        return FiscalPeriod;
    }

    get journalLines() {
        return [JournalLine, {
            onDelete: 'CASCADE'
        }];
    }

    get tags() {
        return [Tag, {
            through: 'JournalTags'
        }]
    }
}
