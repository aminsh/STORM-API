"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    Enums = instanceOf('Enums'),

    view = item => ({
        id: item.id,
        number: item.number,
        date: item.date,
        description: item.description,
        inventoryType: item.inventoryType,
        inventoryTypeDisplay: item.inventoryType ? Enums.InventoryType().getDisplay(item.inventoryType) : null,
        ioType: item.ioType,
        ioTypeDisplay: item.ioType ? Enums.InventoryIOType().getDisplay(item.ioType) : null
    }),

    viewLine = item => ({
        id: item.id,
        productId: item.productId,
        productDisplay: item.productDisplay,
        quantity: item.quantity,
        unitPrice: item.unitPrice
    });

class InventoryQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getAll(inventoryType, parameters) {
        const branchId = this.branchId,
            addFilter = this.addFilter,

            query = this.knex.from(function () {
                let query = this.select('*').from('inventories')
                    .where('branchId', branchId)
                    .where('inventoryType', inventoryType)
                    .as('base');

                if (parameters.extra)
                    addFilter(query, parameters.extra);
            });

        return kendoQueryResolve(query, parameters, view);
    }

    addFilter(query, filter) {
        if (filter.stockId)
            query.where('stockId', filter.stockId);
    }

    getById(id) {
        let knex = this.knex,
            inventory = await(knex.select('*').from('inventories').where('id', id).first());
        /* inventoryLines = await(
             knex.select('*')
                 .from('inventoryLines')
                 .leftJoin('products', 'inventoryLines.productId', 'products.id')
                 .where('inventoryId', inventory.id));*/

        inventory = view(inventory);
        //inventory.inventoryLines = inventoryLines.select(viewLine).toArray();

        return inventory;
    }

    getDetailById(id, parameters) {
        let knex = this.knex,
            query = knex.from(function () {
                this.select('inventoryLines.*', knex.raw('products.title as "productDisplay"'))
                    .from('inventoryLines')
                    .leftJoin('products', 'inventoryLines.productId', 'products.id')
                    .where('inventoryId', id)
                    .as('base');
            }),

            result = await(kendoQueryResolve(query, parameters, viewLine)),

            aggregatesQuery = query.clone(),
            sumTotalPrice = await(aggregatesQuery.select(knex.raw('SUM(CAST("unitPrice" * quantity as FLOAT)) as "sumTotalPrice"'))
                .first())
                .sumTotalPrice,
            aggregates = {sumTotalPrice};

        result.aggregates = aggregates;

        return result;

    }

    getInventoriesByStock(productId, fiscalPeriodId) {
        const knex = this.knex,
            branchId = this.branchId;

        return knex.select(
            'stockId',
            'stockDisplay',
            knex.raw('sum(quantity) as "sumQuantity"'))
            .from(function () {
                this.select(knex.raw('case when "inventories"."inventoryType" = \'input\' then "quantity" else "quantity" * -1 end as "quantity"'),
                    'stockId',
                    knex.raw('stocks.title as "stockDisplay"')
                )
                    .from('inventories')
                    .leftJoin('inventoryLines', 'inventoryLines.inventoryId', 'inventories.id')
                    .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                    .where('inventories.branchId', branchId)
                    .where('fiscalPeriodId', fiscalPeriodId)
                    .where('productId', productId)
                    .as('base');
            })
            .groupBy('stockId', 'stockDisplay');
    }
}

module.exports = InventoryQuery;

