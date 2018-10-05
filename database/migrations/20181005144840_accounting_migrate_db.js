"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('storm_scripts', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('userId');

            table
                .foreign('userId')
                .references('id')
                .inTable('users')
                .onDelete('SET NULL');

            table.string('title');
            table.text('command');
        })
};

exports.down = function(knex, Promise) {

    return knex.schema.dropTable('storm_scripts');
};
