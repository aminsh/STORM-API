"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('applicationLogger', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt');
            table.string('id');
            table.string('branchId');
            table.string('service');
            table.string('status');
            table.json('command');
            table.json('state');
            table.json('result');
        })
        .table('invoiceLines', table => {
            table.string('stockId');
        })
        .table('inventories', table => {
            table.string('journalId');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('applicationLogger')
        .table('invoiceLines', table => {
            table.dropColumn('stockId');
        })
        .table('inventories', table => {
            table.dropColumn('journalId');
        });
};
