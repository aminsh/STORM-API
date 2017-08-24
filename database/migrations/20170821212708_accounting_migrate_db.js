"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('branchThirdParty', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.integer('id').primary();
            table.string('key');
            table.json('data');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('branchThirdParty').dropTable();
};
