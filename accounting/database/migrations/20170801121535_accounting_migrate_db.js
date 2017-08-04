"use strict";

exports.up = function(knex, Promise) {

    return knex
        .schema
        .createTable("tokens",table => {

            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('type');
            table.string('userId');
            table.string('token');

        });

};
exports.down = function(knex, Promise) {

    return knex
        .schema
        .dropTable("tokens");

};