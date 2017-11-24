"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.json('inventoryIds');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('inventoryIds');
        });
};
