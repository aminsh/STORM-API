"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('config', table => {
            table.string('key').primary();
            table.text('value');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('config');
};
