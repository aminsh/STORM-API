"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    SettingRepository = require('../../data/repository.setting'),
    InventoryRepository = require('../../data/repository.inventory');

class InventoryControlBase {

    constructor(branchId, fiscalPeriodId) {
        const settingsRepository = new SettingRepository(branchId);

        this.settings = await(settingsRepository.get());

        this.inventoryRepository = new InventoryRepository(branchId);
        this.fiscalPeriodId = fiscalPeriodId;
    }

    control(cmd) {

    }

    hasInventory(stockId, productId, quantity) {
        const inventory = await(this.inventoryRepository.getInventoryByProduct(productId, stockId));
        return inventory >= quantity;
    }

    get shouldPreventIfInventoryNotExits() {
        if (!this.settings.canControlInventory)
            return false;
        if (this.settings.canCreateSaleOnNoEnoughInventory)
            return false;

        return true;

    }
}

module.exports = InventoryControlBase;