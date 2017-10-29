"use strict";

const
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryControlBase = require('./inventory.control.base'),
    ProductRepository = require('../../../data/repository.product');

class InventoryControlDefaultStock extends InventoryControlBase {

    constructor(branchId, fiscalPeriodId) {
        super(branchId, fiscalPeriodId);

        this.productRepository = new ProductRepository(branchId);
    }

    control(cmd) {
        let errors = [],
            stockId = this.settings.stockId;

        super.control(cmd);

        if (!stockId) {
            errors.push('انبار پیش فرض تعریف نشده');
            return errors;
        }

        const inventoryStatusList = cmd.invoiceLines.asEnumerable()
            .select(async.result(line => ({
                product: line.product,
                quantity: line.quantity,
                hasInventory: await(this.hasInventory(stockId, line.product.id, line.quantity))
            })))
            .toArray();

        if (!this.shouldPreventIfInventoryNotExits)
            return errors;

        if (inventoryStatusList.asEnumerable().any(item => !item.hasInventory)) {
            const products = inventoryStatusList.asEnumerable()
                    .where(item => !item.hasInventory)
                    .select(item => item.product)
                    .toArray(),

                errors = products.asEnumerable()
                    .select(item => `کالای ${item.title} به مقدار درخواست شده موجود نیست`)
                    .toArray();

            return errors;
        }

        return errors;
    }
}

module.exports = InventoryControlDefaultStock;