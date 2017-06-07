"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('purchases', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('number');
            table.string('date');
            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('CASCADE');
            table.string('description');
            table.string('referenceId');
            table.string('branchId');
        })

        .createTable('purchaseLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('productId');

            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');

            table.string('purchaseId');

            table
                .foreign('purchaseId')
                .references('id')
                .inTable('purchases')
                .onDelete('CASCADE');

            table.float('quantity');
            table.float('unitPrice');
            table.float('tax');
            table.float('vat');
            table.float('discount');
            table.string('branchId');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('purchaseLines')
        .dropTable('purchases');
};
