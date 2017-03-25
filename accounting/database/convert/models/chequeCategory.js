"use strict";

const Base = require('./base'),
    _util = require('../_util');

class ChequeCategory extends Base {
    constructor(model, bankId, detailAccountId) {
        super();

        this.detailAccountId = detailAccountId;
        this.bankId = bankId;
        this.receivedOn = _util.date(model.CBdate);
        this.firstPageNumber = model.CBfromN;
        this.lastPageNumber = model.CBfromN + model.CBqty - 1;
        this.totalPages = model.CBqty;
    }
}

module.exports = ChequeCategory;