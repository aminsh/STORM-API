"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('inventory_pricing', table => {
            table.string('description');
        })
        .table('invoice_types', table => {
            table.string('createdById');
        })
        .table('journals', table => {
            table.string('issuer');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('inventory_pricing', table => {
            table.dropColumn('description');
        })
        .table('invoice_types', table => {
            table.dropColumn('createdById');
        })
        .table('journals', table => {
            table.dropColumn('issuer');
        });
};
