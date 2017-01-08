"use strict";

let ModelBase = require('../utilities/bookshelf.ModelBase'),
    Cheque = require('./cheque'),
    Bank = require('./bank'),
    DetailAccount = require('./detailAccount');

class ChequeCategory extends ModelBase {

    // simple types
    get totalPages() {
        return 'INTEGER'
    }
    
    get firstPageNumber() {
        return 'INTEGER'
    }
    get lastPageNumber() {
        return 'INTEGER'
    }
    get receivedOn() {
        return 'STRING';
    }
    get isClosed() {
        return 'BOOLEAN'
    }

    // associations
    get cheques() {
        return [Cheque];
    }

    get detailAccount() {
        return DetailAccount;
    }

    get bank() {
        return Bank;
    }
}

module.exports = ChequeCategory;
