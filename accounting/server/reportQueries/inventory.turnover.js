"use strict";


const BaseQuery = require('../queries/query.base'),
    translate = require('../services/translateService'),
    filterQueryConfig = require('./report.filter.config'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class InventoriesTurnoverReport extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);

        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode;
        this.filter = filter;
        this.filterConfig = new filterQueryConfig(branchId, currentFiscalPeriodId, mode, filter);
        this.options = await(this.filterConfig.getDateOptions());
    }

    getInventoriesTurnover(ids) {
        let knex = this.knex,
            branchId = this.branchId,
            options = this.options;

        return knex.select(knex.raw(
            `CASE WHEN products."referenceId" ISNULL THEN products.title 
                ELSE products.title||' ${translate('Code')} ' ||products."referenceId" END AS product,
             inventories."inventoryType",
             CASE WHEN inventories."inventoryType" = 'output' THEN '${translate('Output')}' 
                ELSE '${translate('Input')}' END AS "inventoryTypeText",
            "inventoryLines".quantity, "inventoryLines"."unitPrice",
            "inventoryLines".quantity*"inventoryLines"."unitPrice" as "totalPrice",
            inventories.date, inventories.number, stocks.title as stock, stocks.id as "stockId"`),
            knex.raw('"inventoryIOTypes".title as "ioType"')
        )
            .from('stocks')
            .where('stocks.branchId', branchId)
            .whereIn('stocks.id', ids)
            .innerJoin('inventories', 'inventories.stockId', 'stocks.id')
            .innerJoin('inventoryIOTypes', 'inventoryIOTypes.id', 'inventories.ioType')
            .innerJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
            .innerJoin('products', 'products.id', 'inventoryLines.productId')
            .whereBetween('inventories.date', [options.fromMainDate, options.toDate])
            .as('inventoriesTurnover')
    }
}

module.exports = InventoriesTurnoverReport;