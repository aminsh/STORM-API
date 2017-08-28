"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('orders', table => {
            table.string('id').primary();
            table.string('branchId');
            table.string('planId');
            table.specificType('orderNumber','serial');
            table.integer('amount');
            table.integer('discount');
            table.integer('vat');
            table.date('expire_at');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('orders');
};
