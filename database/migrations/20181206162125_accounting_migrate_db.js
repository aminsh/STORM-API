"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .createTable('product_price_list', table => {

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('branchId');

            table.string('title');
            table.boolean('isDefault');
        })
        .createTable('product_price_list_lines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('branchId');
            table.float('price', 8);

            table.string('productId');
            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');
        })
        .table('detailAccounts', table => {
            table.string('priceListId');
            table
                .foreign('priceListId')
                .references('id')
                .inTable('product_price_list')
                .onDelete('SET NULL');
        })
};

exports.down = function (knex, Promise) {

    return knex.schema
        .dropTable('product_price_list')
        .dropTable('product_price_list_lines')
        .table('detailAccounts', table.dropColumn('priceListId'));
};
