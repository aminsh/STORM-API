"use strict";


exports.up = function(knex, Promise) {

    return knex.schema
        .createTable('products_inventory', table => {

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
                .onDelete('CASCADE');

            table.double('quantity', 14, 10);

        })
};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('products_inventory');
};
