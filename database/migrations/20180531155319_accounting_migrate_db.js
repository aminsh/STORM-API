"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .table('users', table => {
            table.json('custom_fields');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('users', table => {
            table.dropColumn('custom_fields');
        });
};
