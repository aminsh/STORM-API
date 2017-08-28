"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('branchThirdParty', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('key');
            table.json('data');
            table.string('branchId');
            table
                .foreign('branchId')
                .references('id')
                .inTable('branches')
                .onDelete('CASCADE');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('branchThirdParty');
};
