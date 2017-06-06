"use strict";

const BaseQuery = require('./query.base'),
    enums = require('../constants/enums'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class SalesQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    };

    TaxInvoice(season) {

    }
};