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

            query = this.knex.from(function () {
                this.select('*').from('inventories')
                    .where('branchId', branchId)
                    .where('inventoryType', inventoryType)
                    .as('base');
            });

        return kendoQueryResolve(query, parameters, view);
    }

    getById(id) {
        let knex = this.knex,
            inventory = await(knex.select('*').from('inventories').where('id', id).first()),
            inventoryLines = await(
                knex.select('*')
                    .from('inventoryLines')
                    .leftJoin('products', 'inventoryLines.productId', 'products.id')
                    .where('inventoryId', inventory.id));

        inventory = view(inventory);
        inventory.inventoryLines = inventoryLines.select(viewLine).toArray();

        return inventory;
    }
}

module.exports = InventoryQuery;

