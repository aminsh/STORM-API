"use strict";

const
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    InventoryControlBase = require('./inventory.control.base'),
    ProductRepository = require('../../../data/repository.product');

class InventoryControlStockOnRequest extends InventoryControlBase {

    constructor(branchId, fiscalPeriodId) {
        super(branchId, fiscalPeriodId);

        this.productRepository = new ProductRepository(branchId);
    }

    control(cmd) {
        let errors = [];

        super.control(cmd);

        let invoiceLines = await(this.productRepository.findByIds(cmd.invoiceLines.asEnumerable().select(item => item.productId).toArray()))
            .asEnumerable()
            .join(cmd.invoiceLines,
                first => first.id,
                second => second.productId,
                (first, second) => ({
                    product: first,
                    quantity: second.quantity,
                    stockId: second.stockId
                }))
            .where(item => item.product.productType === 'good')
            .toArray();

        if (!invoiceLines.asEnumerable().all(item => item.stockId)) {
            errors.push('انبار در یکی از ردیفهای کالا انتخاب نشده');
            return errors;
        }

        const inventoryStatusList = invoiceLines.asEnumerable()
            .select(async.result(line => ({
                product: line.product,
                quantity: line.quantity,
                hasInventory: await(this.hasInventory(line.stockId, line.product.id, line.quantity))
            })))
            .toArray();

        if (!this.shouldPreventIfInventoryNotExits)
            return errors;

        if (inventoryStatusList.asEnumerable().any(item => !item.hasInventory)) {

            errors = inventoryStatusList
                .asEnumerable()
                .where(item => !item.hasInventory)
                .select(item => `کالای ${item.product.title} به مقدار درخواست شده موجود نیست`)
                .toArray();
        }

        return errors;

    }
}

module.exports = InventoryControlStockOnRequest;