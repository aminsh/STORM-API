"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .table("inventoryLines", table => table.dropForeign("invoiceLineId"))

        .table("inventoryLines", table =>  table
            .foreign('invoiceLineId')
            .references('id')
            .inTable('invoiceLines')
            .onDelete('SET NULL'))

        .table("inventories", table => table.dropForeign("invoiceId"))

        .table("inventories", table => table
            .foreign('invoiceId')
            .references('id')
            .inTable('invoices')
            .onDelete('SET NULL'));
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table("inventoryLines", table => table.dropForeign("invoiceLineId"))

        .table("inventoryLines", table =>  table
            .foreign('invoiceLineId')
            .references('id')
            .inTable('invoiceLines')
            .onDelete('CASCADE'))

        .table("inventories", table => table.dropForeign("invoiceId"))

        .table("inventories", table => table
            .foreign('invoiceId')
            .references('id')
            .inTable('invoices')
            .onDelete('CASCADE'));
};
