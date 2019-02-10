"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.boolean('canSaleGenerateAutomaticOutput');
        })
        .createTable('products_stocks', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('branchId');
            table.string('productId');
            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');
            table.string('stockId');
            table
                .foreign('stockId')
                .references('id')
                .inTable('stocks')
                .onDelete('RESTRICT');
            table.boolean('isDefault');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.dropColumn('canSaleGenerateAutomaticOutput');
        })
        .dropTable('products_stocks');
};
