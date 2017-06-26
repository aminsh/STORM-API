"use strict";

const enums = require('../../shared/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('stocks', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('title');
        })
        .createTable('inventories', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('number');
            table.string('date');
            table.string('fiscalPeriodId');
            table.string('stockId');
            table
                .foreign('stockId')
                .references('id')
                .inTable('stocks')
                .onDelete('SET NULL');

            table.enu('inventoryType', enums.InventoryType().getKeys());
            table.string('description');
        })
        .createTable('inventoryLines', table => {
            table.string('productId');
            table.float('quantity');
            table.float('unitPrice');
            table.string('inventoryId');
            table
                .foreign('inventoryId')
                .references('id')
                .inTable('inventories')
                .onDelete('CASCADE');
        });

};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('inventories')
        .dropTable('inventoryLines')
        .dropTable('stocks');
};
