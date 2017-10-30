"use strict";


const BaseQuery = require('../queries/query.base');

module.exports = class InventoriesReport extends BaseQuery{
    constructor(branchId){
        super(branchId);
    }

    getInventories(ids){
        let knex = this.knex,
            branchId = this.branchId;

        return knex.select(knex.raw(
            `products.title as product,
            products."referenceId" as "productReferenceId",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity*"inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, stocks.title as stock,
            invoices.description`
        ))
            .from('inventories')
            .where('inventories.branchId', branchId)
            .whereIn('inventories.id',ids)
            .innerJoin('inventoryLines','inventoryLines.inventoryId','inventories.id')
            .innerJoin('products','products.id','inventoryLines.productId')
            .innerJoin('stocks','stocks.id','inventories.stockId')
            .leftJoin('invoices','invoices.id','inventories.invoiceId')
            .leftJoin('invoiceLines','invoiceLines.invoiceId','invoices.id')
            .as('inventory')
    }
}