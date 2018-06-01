"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .createTable('storm_plans', table => {

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();

            table.string('name');
            table.string('title');
            table.string('description');
            table.integer('price').unsigned();
            table.string('category');

            table.json('discount');
            table.json('features');

        })
        .createTable('storm_gifts', table => {

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();

            table.string('planId');
            table
                .foreign('planId')
                .references('id')
                .inTable('storm_plans')
                .onDelete('SET NULL');

            table.string('code');
            table.string('minDate');
            table.string('maxDate');

            table.string('discountRate');

        })
        .createTable('storm_orders', table => {

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();

            table.string('invoiceId');

            table.string('number');
            table.dateTime('issuedDate');
            table.dateTime('paidDate');

            table.string('branchId');
            table
                .foreign('branchId')
                .references('id')
                .inTable('branches')
                .onDelete('SET NULL');

            table.string('giftId');
            table
                .foreign('giftId')
                .references('id')
                .inTable('storm_gifts')
                .onDelete('SET NULL');

            table.string('planId');
            table
                .foreign('planId')
                .references('id')
                .inTable('storm_plans')
                .onDelete('RESTRICT');

            table.integer('duration');
            table.integer('unitPrice');
            table.integer('discount');

        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('storm_plans')
        .dropTable('storm_gifts')
        .dropTable('storm_orders');

};
