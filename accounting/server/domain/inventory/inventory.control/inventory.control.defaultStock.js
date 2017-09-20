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

        const inventoryStatusList = cmd.lines.asEnumerable()
            .select(line => async.result(({
                productId: line.productId,
                quantity: line.quantity,
                hasInventory: await(this.hasInventory(stockId, line.productId, line.quantity))
            })))
            .toArray();

        if (!this.shouldPreventIfInventoryNotExits)
            return errors;

        if (inventoryStatusList.asEnumerable().any(item => !item.hasInventory)) {
            const ids = inventoryStatusList.asEnumerable()
                    .where(item => !item.hasInventory)
                    .select(item => item.productId)
                    .toArray(),

                products = await(this.productRepository.findByIds(ids));

            errors = errors.concat(products.asEnumerable()
                .select(item => `کالای ${item.title} به مقدار درخواست شده موجود نیست`)
                .toArray());
        }

        return errors;

    }
}

module.exports = InventoryControlDefaultStock;