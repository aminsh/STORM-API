"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('verification', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('code');
            table.string('mobile');
            table.json('data');

        })
        .table('users', table => {
            table.string('mobile');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('verification')
        .table('users', table => {
            table.dropColumn('mobile');
        })
};
