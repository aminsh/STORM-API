"use strict";

const OneStockBase = require('./oneStockBase');

class DefaultStock extends OneStockBase {

    constructor(branchId, fiscalPeriodId){

        super(branchId, fiscalPeriodId);

        this.stockId = this.settings.stockId;
    }
}

module.exports = DefaultStock;