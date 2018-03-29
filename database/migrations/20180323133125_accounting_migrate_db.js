"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('chequeCategories', table => {
            table.dropColumn('bankId');

            table.renameColumn('detailAccountId', 'bankId');
            table.renameColumn('receivedOn', 'receiveDate');

            table.string('bankName');
            table.json('cheques');
            table.string('createdById');
        })
        .dropTable('cheques');
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('chequeCategories', table => {

            table.dropColumn('bankName');
            table.dropColumn('bankId');
            table.dropColumn('cheques');
            table.dropColumn('createdById');

            table.string('bankId');
            table
                .foreign('bankId')
                .references('id')
                .inTable('banks')
                .onDelete('SET NULL');

            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('SET NULL');


            table.renameColumn('receiveDate', 'receivedOn');

        })
        .createTable('cheques', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('number');
            table.string('date');
            table.string('description');
            table.float('amount', 8);
            table.string('status');
        })
};
