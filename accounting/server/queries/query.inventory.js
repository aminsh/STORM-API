"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    productView = require('../viewModel.assemblers/view.product'),
    Enums = instanceOf('Enums'),

    view = item => ({
        id: item.id,
        number: item.number,
        date: item.date,
        display: item.display,
        description: item.description,
        inventoryType: item.inventoryType,
        inventoryTypeDisplay: item.inventoryType ? Enums.InventoryType().getDisplay(item.inventoryType) : null,
        ioType: item.ioType,
        ioTypeDisplay: item.ioType ? Enums.InventoryIOType().getDisplay(item.ioType) : null,
        stockId: item.stockId,
        stockDisplay: item.stockDisplay,
        journalId: item.journalId,
        inputId: item.inputId,
        outputId: item.outputId,
        invoiceId: item.invoiceId
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

    getAllInventoryProducts(parameters) {
        let stockId = parameters.extra && parameters.extra.filter
            ? parameters.extra.filter.stockId
            : null,
            knex = this.knex,
            branchId = this.branchId,


            subquery = knex.select('productId')
                .from('inventoryLines')
                .innerJoin('inventories', 'inventories.id', 'inventoryLines.inventoryId')
                .where('inventoryLines.branchId', branchId);

        if (stockId)
            subquery.andWhere('inventories.stockId', stockId);

        let query = knex.select()
            .from(function () {
                this.select('products.*', knex.raw('scales.title as "scaleDisplay"'))
                    .from('products')
                    .leftJoin('scales', 'products.scaleId', 'scales.id')
                    .where('products.branchId', branchId)
                    .whereIn('products.id', subquery)
                    .as('base');
            });

        return kendoQueryResolve(query, parameters, productView);
    }

    getAll(inventoryType, parameters) {
        const branchId = this.branchId,
            addFilter = this.addFilter,
            knex = this.knex,

            query = knex.from(function () {
                let query = this.select('inventories.*', knex.raw('stocks.title as "stockDisplay"')).from('inventories')
                    .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                    .where('inventories.branchId', branchId)
                    .where('inventoryType', inventoryType)
                    .as('base');

                if (parameters.extra)
                    addFilter(query, parameters.extra);
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getAllWithoutInvoice(inventoryType, parameters) {
        const branchId = this.branchId,
            knex = this.knex,

            query = knex.from(function () {
                this.select(
                    'inventories.*',
                    knex.raw(`inventories.number || ' - ' || inventories.date || ' - ' || stocks.title as display`),
                    knex.raw('stocks.title as "stockDisplay"')
                )
                    .from('inventories')
                    .leftJoin('stocks', 'stocks.id', 'inventories.stockId')
                    .where('inventories.branchId', branchId)
                    .where('inventoryType', inventoryType)
                    .whereNull('invoiceId')
                    .whereNull('journalId')
                    .as('base');
            });

        return kendoQueryResolve(query, parameters, view);
    }

    addFilter(query, filter) {
        if (filter.stockId)
            query.where('stockId', filter.stockId);
    }

    getById(id) {
        let knex = this.knex,
            inventory = await(knex.select('inventories.*', knex.raw('stocks.title as "stockDisplay"'))
                .from('inventories')
                .leftJoin('stocks', 'inventories.stockId', 'stocks.id')
                .where('inventories.id', id)
                .first()),
            inventoryLines = await(
                knex.select('inventoryLines.*', knex.raw('products.title as "productDisplay"'))
                    .from('inventoryLines')
                    .leftJoin('products', 'inventoryLines.productId', 'products.id')
                    .where('inventoryId', inventory.id));

        inventory = view(inventory);
        inventory.inventoryLines = inventoryLines.asEnumerable().select(viewLine).toArray();

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

            sumTotalPrice = await(knex
                .select(knex.raw('SUM(CAST("unitPrice" * quantity as FLOAT)) as "sumTotalPrice"'))
                .from('inventoryLines').where('inventoryId', id)
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

    getMaxNumber(inventoryType, fiscalPeriodId) {

        const maxNumber = await(this.knex.table('inventories')
            .modify(this.modify, this.branchId)
            .where('inventoryType', inventoryType)
            .andWhere('fiscalPeriodId', fiscalPeriodId)
            .max('number')
            .first());

        if (maxNumber)
            return maxNumber.max;

        return 1;
    }
}

module.exports = InventoryQuery;

