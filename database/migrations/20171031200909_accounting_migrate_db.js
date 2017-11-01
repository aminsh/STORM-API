"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.string('title');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('title');
        });
};
