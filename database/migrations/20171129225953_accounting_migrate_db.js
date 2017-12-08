"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.json('saleChanges');
        })
        .table('invoices', table => {
            table.json('costs');
            table.json('charges');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.dropColumn('saleChanges');
        })
        .table('invoices', table => {
            table.dropColumn('costs');
            table.dropColumn('charges');
        });
};
