"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('subsidiaryLedgerAccounts', table => {
            table.dropColumn('isActive');
            table.boolean('isLocked');
        })
        .table('generalLedgerAccounts', table => {
            table.dropColumn('isActive');
            table.boolean('isLocked');
        })

        .createTable('scales', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('branchId');

            table.string('title');
        })

        .table('products', table => {
            table.string('scaleId');

            table
                .foreign('scaleId')
                .references('id')
                .inTable('scales')
                .onDelete('SET NULL');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('subsidiaryLedgerAccounts', table => {
            table.boolean('isActive');
            table.dropColumn('isLocked');
        })
        .table('generalLedgerAccounts', table => {
            table.boolean('isActive');
            table.dropColumn('isLocked');
        })

        .dropTable('scales')

        .table('products', table => {
            table.dropColumn('scaleId');
        });
};
