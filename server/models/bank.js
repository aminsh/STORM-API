"use strict";

let ModelBase = require('../utilities/bookshelf.ModelBase'),
    ChequeCategory = require('./chequeCategory');

class Bank extends ModelBase {
    get title() {
        return 'STRING';
    }
    get category() {
        return ChequeCategory;
    }
}

module.exports = Bank;
