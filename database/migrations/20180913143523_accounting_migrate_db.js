"use strict";

exports.up = function(knex, Promise) {

    return knex.schema.createTable('products_inventory', table => {
        table.increments('id').primary();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());

        table.string('productId');
        table.string('stockId');
        table.string('branchId');
        table.string('fiscalPeriodId');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('products_inventory');
};
