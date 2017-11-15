"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .table('invoices', table => {
           table.text('description').alter();
        })
        .table('settings', table => {
            table.text('invoiceDescription');
        })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.string('description').alter();
        })
        .table('settings', table => {
            table.dropColumn('invoiceDescription');
        });
};
