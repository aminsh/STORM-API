"use strict";

const InventoryRepository = require('./data').InventoryRepository,
    ProductService = require('./product');

class InventoryControlService {

    constructor(branchId, fiscalPeriodId) {
        this.fiscalPeriodId = fiscalPeriodId;
        this.branchId = branchId;
        this.inventoryRepository = new InventoryRepository(branchId);
    }

    _isValidInventoryTurnover(inventories) {
        if (inventories.length === 0) return true;

        let inventoryTurnover = inventories
            .map(item => {
                item.total = item.quantity * (item.inventoryType === 'input' ? 1 : -1);
                return item;
            })
            .reduce((memory, current) => {
                if (Array.isArray(memory)) {
                    let last = memory.asEnumerable().lastOrDefault(),
                        remainder = last ? last.remainder : 0;

                    current.remainder = remainder + current.total;
                    memory.push(current);
                    return memory;
                }
                else {
                    memory.remainder = memory.total;
                    current.remainder = memory.remainder + current.total;
                    return [memory, current];
                }
            });

        return inventoryTurnover.asEnumerable().all(item => item.remainder >= 0);
    }

    validateTurnover(inventory) {
        let lines = inventory.inventoryLines,
            productService = new ProductService(this.branchId);

        return lines.asEnumerable()
            .where(item => item.id)
            .select(item => {
                let inventories = this.inventoryRepository.getInventoriesByProductId(item.productId, this.fiscalPeriodId, inventory.stockId),
                    current = inventories.asEnumerable().singleOrDefault(e => e.id === item.id);

                current.quantity = item.quantity;

                return {
                    isValid: this._isValidInventoryTurnover(inventories),
                    product: productService.findByIdOrCreate({id: item.productId})
                };
            })
            .where(item => !item.isValid)
            .select(item => 'برای کالای {0} موجودی منفی میشود'.format(item.product.title))
            .toArray();
    }

}

module.exports = InventoryControlService;