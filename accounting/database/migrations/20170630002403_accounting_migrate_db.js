"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.string('invoiceId');
            table
                .foreign('invoiceId')
                .references('id')
                .inTable('invoices')
                .onDelete('CASCADE');

            table.string('branchId');
        })
        .table('inventoryLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('invoiceLineId');
            table
                .foreign('invoiceLineId')
                .references('id')
                .inTable('invoiceLines')
                .onDelete('CASCADE');
            table.string('branchId');
        })
        .table('stocks', table => {
            table.string('branchId');
        })
        .table('settings', table => {
           table.string('bankId');
            table
                .foreign('bankId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('SET NULL');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.dropColumn('invoiceId');
            table.dropColumn('branchId');
        })
        .table('inventoryLines', table => {
            table.dropColumn('invoiceLineId');
            table.dropColumn('branchId');
        })
        .table('stocks', table => {
            table.dropColumn('branchId');
        })
        .table('settings', table => {
           table.dropColumn('bankId');
        });
};
