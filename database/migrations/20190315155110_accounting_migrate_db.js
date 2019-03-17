"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => table.string('currencyId'))
        .createTable('currency', table => {
            table.string('id').primary();
            table.string('title');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('invoices', table => table.dropColumn('currencyId'))
        .dropTable('currency');
};
