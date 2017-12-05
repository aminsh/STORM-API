"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.join('custom');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('custom');
        });
};
