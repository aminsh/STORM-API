"use strict";

const Base = require('./base'),
    _util = require('../_util');

class Cheque extends Base {
    constructor(number, categoryId, document) {
        super();

        this.chequeCategoryId = categoryId;
        this.number = number;
        this.status = 'White';

        this.ifHasDocument(document);
    }

    ifHasDocument(document) {
        if (!document) return;

        this.date = _util.date(document.ChequeDate);
        this.status = 'Used';
        this.description = document.ChequeDesc;
        this.amount = document.Bes;
        this.journalLineId = document.NC;
    }
}

module.exports = Cheque;