"use strict";


const BaseQuery = require('../queries/query.base'),
    translate = require('../services/translateService'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class ProductReports extends BaseQuery {
    constructor(branchId) {
        super(branchId);

        this.getProductTurnovers = async(this.getProductTurnovers);

    }

    getProductsInventoriesByIds(productIds) {
        let knex = this.knex,
            branchId = this.branchId;

        return this.knex.select(knex.raw(
            `products.title as product,
            inventories."inventoryType",
            products."referenceId" as "productReferenceId",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity*"inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, stocks.title as stock,
            CASE WHEN inventories."ioType" = 'inputFirst' THEN '${translate('First input')}' 
                  WHEN inventories."ioType" = 'inputPurchase' THEN '${translate('Purchase')}'
                  WHEN inventories."ioType" = 'inputStockToStock' THEN '${translate('stock to stock')}'
                  WHEN inventories."ioType" = 'inputBackFromSaleOrConsuming' THEN '${translate('ReturnSales')}'
                  WHEN inventories."ioType" = 'outputSale' THEN '${translate('Sale')}'
                  WHEN inventories."ioType" = 'outputWaste' THEN '${translate('damages')}' END AS "ioType"`
        ))
            .from('inventories')
            .where('inventories.branchId', branchId)
            .innerJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
            .innerJoin('products', 'products.id', 'inventoryLines.productId')
            .innerJoin('stocks', 'stocks.id', 'inventories.stockId')
            .whereIn('products.id', productIds)
            .as('inventory');
    }

    getProductTurnovers(productIds) {
        let productsInventories = await(this.getProductsInventoriesByIds(productIds)),

            productTurnovers = productsInventories
                .map(item => {
                    item.turnoverQuantity = item.quantity * (item.inventoryType === 'input' ? 1 : -1);
                    return item;
                })
                .reduce((memory, current) => {
                    if (Array.isArray(memory)) {
                        let last = memory[memory.length - 1];
                        current.quantityRemainder = current.turnoverQuantity + last.quantityRemainder;

                        current.unitPriceRemainder = current.inventoryType === 'output'
                            ? last.unitPriceRemainder
                            : ((last.quantity * last.unitPrice) + (current.quantity * current.unitPrice))
                            / (last.quantity + current.quantity);

                        current.totalPriceRemainder = current.unitPriceRemainder * current.quantityRemainder;

                        memory.push(current);
                        return memory;
                    }
                    else {
                        memory.quantityRemainder = memory.turnoverQuantity;
                        current.quantityRemainder = memory.quantityRemainder + current.turnoverQuantity;

                        memory.unitPriceRemainder = memory.inventoryType === 'output'
                            ? memory.unitPriceRemainder
                            : (memory.quantity * memory.unitPrice) / memory.quantity;
                        current.unitPriceRemainder = current.inventoryType === 'output'
                            ? memory.unitPriceRemainder
                            : ((memory.quantity * memory.unitPrice) + (current.quantity * current.unitPrice))
                            / (memory.quantity + current.quantity);

                         memory.totalPriceRemainder = memory.unitPriceRemainder * memory.quantityRemainder;
                         current.totalPriceRemainder = current.quantityRemainder * memory.unitPriceRemainder;

                        return [memory, current];
                    }
                });

        return productTurnovers;
    }
}