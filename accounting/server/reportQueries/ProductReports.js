"use strict";


const BaseQuery = require('../queries/query.base'),
    translate = require('../services/translateService'),
    FilterQueryConfig = require('./report.filter.config'),
    enums = require('../../../shared/enums'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class ProductReports extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);

        this.currentFiscalPeriodId = currentFiscalPeriodId;

        this.mode = mode;
        this.filter = filter;
        this.filterConfig = new FilterQueryConfig(branchId, currentFiscalPeriodId, mode, filter);
        this.options = await(this.filterConfig.getDateOptions());
    }

    getProductsInventoriesByIds(productIds, fixedType, stockId) {
        let knex = this.knex,
            branchId = this.branchId,

            query = this.knex.select(
                knex.raw(`products.title as product,
            inventories."fixedAmount",
            inventories."createdAt",
            products.id as "productId",
            inventories."inventoryType",
            products."referenceId" as "productReferenceId",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity * "inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, 
            stocks.title as stock, stocks.id as "stockId",
            scales.title as "scaleTitle",
            CASE WHEN inventories."inventoryType" = 'input' THEN '${translate('Input')}'
             ELSE '${translate('Output')}' END as "inventoryTypeTitle",
            inventories."ioType" as ioType`),
                knex.raw('"inventoryIOTypes".title as "ioTypeText"')
            )
                .from('products')
                .where('products.branchId', branchId)
                .innerJoin('inventoryLines', 'inventoryLines.productId', 'products.id')
                .innerJoin('inventories', 'inventories.id', 'inventoryLines.inventoryId')
                .innerJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
                .leftJoin('scales', 'scales.id', 'products.scaleId')
                .innerJoin('stocks', 'stocks.id', 'inventories.stockId')
                .orderBy('inventories.createdAt');


        if (fixedType === 'fixedQuantity')
            query.where('fixedQuantity', true);

        if (fixedType === 'fixedAmount')
            query.where('fixedAmount', true);

        if (fixedType === 'fixedAmountAndQuantity')
            query
                .where('fixedQuantity', true)
                .where('fixedAmount', true);

        if (productIds)
            query.whereIn('products.id', productIds);

        if (stockId && !stockId.includes('all')) {
            query.whereIn('stocks.id', stockId);
        }


        return query;
    };

    getProductRemainders(inventories) {
        let haveZeroUnitPrice = inventories.asEnumerable().firstOrDefault(item => item.unitPrice == 0) ? 0 : 1;

        if (inventories.length === 1) {
            return inventories.asEnumerable().select(item =>
                Object.assign({}, item,
                    {
                        quantityRemainder: item.quantity,
                        haveZeroUnitPrice: haveZeroUnitPrice,
                        unitPriceRemainder: item.unitPrice,
                        totalPriceRemainder: item.totalPrice,
                        lastTotalPriceRemainder: item.totalPrice,
                        lastQuantityRemainder: item.quantity
                    })
            );

        }
        else {
            let query = inventories
                .map(item => {
                    item.turnoverQuantity = item.quantity * (item.inventoryType === 'input' ? 1 : -1);
                    return item;
                })
                .reduce((memory, current) => {
                    if (Array.isArray(memory)) {
                        let last = memory[memory.length - 1];
                        current.quantityRemainder = current.turnoverQuantity + last.quantityRemainder;
                        current.haveZeroUnitPrice = haveZeroUnitPrice;

                        if (current.inventoryType === 'input'
                            && (current.unitPrice === 0 || last.unitPriceRemainder === 0)
                            && current.productId === last.productId) {
                            current.unitPriceRemainder = 0;
                            current.totalPriceRemainder = 0;
                        }
                        else {
                            current.unitPriceRemainder = current.inventoryType === 'output'
                                ? last.unitPriceRemainder
                                : (last.totalPriceRemainder + current.totalPrice) / current.quantityRemainder;

                            current.totalPriceRemainder = current.unitPriceRemainder * current.quantityRemainder;
                        }
                        memory.push(current);
                        return memory;
                    }
                    else {
                        memory.quantityRemainder = memory.turnoverQuantity;
                        current.quantityRemainder = memory.quantityRemainder + current.turnoverQuantity;
                        memory.haveZeroUnitPrice = haveZeroUnitPrice;
                        current.haveZeroUnitPrice = haveZeroUnitPrice;

                        memory.unitPriceRemainder = memory.inventoryType === 'output'
                            ? memory.unitPriceRemainder
                            : (memory.quantity * memory.unitPrice) / memory.quantity;
                        memory.totalPriceRemainder = memory.unitPriceRemainder * memory.quantityRemainder;

                        if (current.inventoryType === 'input'
                            && (current.unitPrice === 0 || memory.unitPrice === 0)
                            && current.productId === memory.productId) {
                            current.unitPriceRemainder = 0;
                            current.totalPriceRemainder = 0;
                        }
                        else {
                            current.unitPriceRemainder = current.inventoryType === 'output'
                                ? memory.unitPriceRemainder
                                : (memory.totalPriceRemainder + current.totalPrice) / current.quantityRemainder;

                            current.totalPriceRemainder = current.quantityRemainder * current.unitPriceRemainder;
                        }
                        ;
                        return [memory, current];
                    }
                });

            return query.asEnumerable()
                .select(item => Object.assign(
                    {},
                    item,
                    {
                        lastTotalPriceRemainder: query.asEnumerable()
                            .where(q => q.date >= this.options.fromMainDate && q.date <= this.options.toDate)
                            .lastOrDefault().totalPriceRemainder
                        ,

                        lastQuantityRemainder: query.asEnumerable()
                            .where(q => q.date >= this.options.fromMainDate && q.date <= this.options.toDate)
                            .lastOrDefault().quantityRemainder
                    }
                ))
        }

    }

    getProductTurnovers(productIds, fixedType, stockId) {
        let productsInventories = await(this.getProductsInventoriesByIds(productIds, fixedType, stockId)),
            options = this.options,

            query = productsInventories.asEnumerable()
                .groupBy(
                    item => item.productId,
                    item => item,
                    (key, value) => ({
                        productId: key,
                        items: this.getProductRemainders(value.toArray())
                            .asEnumerable()
                            .select(item => Object.assign(
                                {},
                                item,
                                {remainderToString: item.unitPriceRemainder ? item.unitPriceRemainder.toString() : item.unitPriceRemainder}
                                )
                            )
                    }))
                .selectMany(item => item.items)
                .where(item => item.date >= options.fromMainDate && item.date <= options.toDate)
                .toArray();

        return query;
    }
}

module.exports = ProductReports;