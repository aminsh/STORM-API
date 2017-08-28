"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('plans', table => {
            table.string('id').primary();
            table.string('title');
            table.text('description');
            table.integer('cost');
            table.integer('duration');
            table.integer('factorsCount');
            table.json('gift');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('plans');
};
