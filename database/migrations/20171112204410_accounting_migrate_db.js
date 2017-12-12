"use strict";

const enums = require('../../shared/enums'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('gifts', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('title');
            table.string('description');
            table.integer('invoice');
            table.integer('duration');
            table.integer('discountPrice');
            table.integer('discountPercentage');
            table.integer('giftKey');
            table.integer('reusableCount');
            table.boolean('reusableStatus');
            table.timestamp('startDate');
            table.timestamp('endDate');
            table.boolean('dateStatus');
            table.boolean('isArchived');
        })
        .createTable('planCategories', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('orderNumber');
            table.string('title');
            table.string('description');
            table.boolean('isArchived');
        })
        .createTable('plans', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('title');
            table.string('description');
            table.integer('duration');
            table.boolean('durationStatus');
            table.integer('invoice');
            table.boolean('invoiceStatus');
            table.integer('price');
            table.integer('reusableCount');
            table.boolean('reusableStatus');
            table.string('planCategoryId');
            table
                .foreign('planCategoryId')
                .references('id')
                .inTable('planCategories')
                .onDelete('CASCADE')
            table.string('giftId');
            table
                .foreign('giftId')
                .references('id')
                .inTable('gifts')
                .onDelete('SET NULL');
            table.boolean('isArchived').defaultTo(false);
        })
        .createTable('orders', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('branchId');
            table
                .foreign('branchId')
                .references('id')
                .inTable('branches')
                .onDelete('SET NULL');
            table.string('planId');
            table
                .foreign('planId')
                .references('id')
                .inTable('plans')
                .onDelete('SET NULL');
            table.enu('paymentStatus', enums.OrderStatus().getKeys()).defaultTo('waitForPayment');

        })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('orders')
        .dropTable('plans')
        .dropTable('gifts')
        .dropTable('planCategories');
}
