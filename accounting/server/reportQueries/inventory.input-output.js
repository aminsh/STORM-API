"use strict";


const BaseQuery = require('../queries/query.base');

class InventoriesReport extends BaseQuery{
    constructor(branchId, userId){
        super(branchId, userId);
    }

    getInventories(ids){
        let knex = this.knex,
            branchId = this.branchId,
            userId = this.userId,
            canView = this.canView(),
            modify = this.modify;

        return knex.select(knex.raw(
            `products.title as product,
            products."referenceId" as "productReferenceId",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity*"inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, stocks.title as stock,
            "invoiceLines".description`
        ))
            .from('inventories')
            .modify(modify, branchId, userId, canView, 'inventories')
            .whereIn('inventories.id',ids)
            .innerJoin('inventoryLines','inventoryLines.inventoryId','inventories.id')
            .innerJoin('products','products.id','inventoryLines.productId')
            .innerJoin('stocks','stocks.id','inventories.stockId')
            .leftJoin('invoices','invoices.id','inventories.invoiceId')
            .leftJoin('invoiceLines','invoiceLines.invoiceId','invoices.id')
            .as('inventory')
    }
}

module.exports = InventoriesReport;