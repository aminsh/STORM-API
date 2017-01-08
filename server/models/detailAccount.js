"use strict";

let ModelBase = require('../utilities/bookshelf.ModelBase');

class DetailAccount extends ModelBase {
    get code() {
        return 'STRING';
    }

    get title() {
        return 'STRING';
    }

    get description() {
        return 'STRING';
    }
    get isActive() {
        return 'BOOLEAN';
    }
}

module.exports = DetailAccount;
