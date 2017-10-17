"use strict";

const OneStockBase = require('./oneStockBase');

class StockOnRequest extends OneStockBase {

    constructor(branchId, fiscalPeriodId){

        super(branchId, fiscalPeriodId);
    }

    set(cmd){
        this.stockId = cmd.stockId;

        return super.set(cmd);
    }
}

module.exports = StockOnRequest;