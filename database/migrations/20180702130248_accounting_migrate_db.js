"use strict";

exports.up = function(knex, Promise) {

    return knex.schema
        .table('invoiceLines', table => {
            table.float('tax');
        })
        .table('settings' , table => {
            table.integer('tax');
        });
};

exports.down = function(knex, Promise) {

    return knex.schema
        .table('invoiceLines', table => {
            table.dropColumn('tax');
        })
        .table('settings', table => {
            table.dropColumn('tax');
        });
};
