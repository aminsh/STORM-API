"use strict";

exports.up = function(knex, Promise) {

    return knex.schema
        .createTable('branch_subscriptions', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.increments('id').primary();

            table.date('startDate');
            table.date('endDate');

            table.string('branchId');
            table
                .foreign('branchId')
                .references('id')
                .inTable('branches')
                .onDelete('RESTRICT');

            table.string('planId');
            table
                .foreign('planId')
                .references('id')
                .inTable('storm_plans')
                .onDelete('RESTRICT');

            table.boolean('isActiveApi');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('branch_subscriptions');
};
