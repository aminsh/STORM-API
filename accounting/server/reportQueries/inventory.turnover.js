"use strict";


const BaseQuery = require('../queries/query.base'),
      translate = require('../services/translateService');

module.exports = class InventoriesTurnoverReport extends BaseQuery{
    constructor(branchId){
        super(branchId);
    }

    getInventoriesTurnover(ids){
        let knex = this.knex,
            branchId = this.branchId;

        return knex.select(knex.raw(
            `CASE WHEN products."referenceId" ISNULL THEN products.title 
                ELSE products.title||' ${translate('Code')} ' ||products."referenceId" END AS product,
             inventories."inventoryType",
             CASE WHEN inventories."inventoryType" = 'output' THEN '${translate('Output')}' 
                ELSE '${translate('Input')}' END AS "inventoryTypeText",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity*"inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, stocks.title as stock, stocks.id as "stockId",
            CASE WHEN inventories."ioType" = 'inputFirst' THEN '${translate('First input')}' 
                  WHEN inventories."ioType" = 'inputPurchase' THEN '${translate('Purchase')}'
                  WHEN inventories."ioType" = 'inputStockToStock' THEN '${translate('stock to stock')}'
                  WHEN inventories."ioType" = 'inputBackFromSaleOrConsuming' THEN '${translate('ReturnSales')}'
                  WHEN inventories."ioType" = 'outputSale' THEN '${translate('Sale')}'
                  WHEN inventories."ioType" = 'outputWaste' THEN '${translate('damages')}' END AS "ioType"`
        ))
            .from('stocks')
            .where('stocks.branchId', branchId)
            .whereIn('stocks.id',ids)
            .innerJoin('inventories','inventories.stockId','stocks.id')
            .innerJoin('inventoryLines','inventoryLines.inventoryId','inventories.id')
            .innerJoin('products','products.id','inventoryLines.productId')
            .as('inventory')
    }
}