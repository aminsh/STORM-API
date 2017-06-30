"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryRepository = require('../data/repository.inventory');


module.exports = class InventoryDomain {
    constructor(branchId, fiscalPeriodId) {
        this.branchId = branchId;
        this.fiscalPeriodId = fiscalPeriodId;

        this.inventoryRepository = new InventoryRepository(branchId);

        this.getPrice = async(this.getPrice);
    }

    getPrice(productId) {
        let inputs = await(this.inventoryRepository
                .getAllInputBeforeDate(this.fiscalPeriodId, productId, new Date)),
            sumPrice = inputs.asEnumerable().sum(e => (e.unitPrice * e.quantity)),
            sumQuantity = inputs.asEnumerable().sum(e => e.quantity);

        return sumPrice / sumQuantity;
    }

    getInventory(productId){
        let result = await(this.inventoryRepository.inventoryByProduct(productId, this.fiscalPeriodId));
        return result.sum || 0;
    }
};