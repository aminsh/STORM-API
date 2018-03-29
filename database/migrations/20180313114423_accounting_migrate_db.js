"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('treasury', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('id').primary();
            table.string('branchId').notNull();
            table.string('transferDate');
            table.string('sourceDetailAccountId');
            table
                .foreign('sourceDetailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('RESTRICT');

            table.string('destinationDetailAccountId');
            table
                .foreign('destinationDetailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('RESTRICT');

            table.double('amount', 14, 10).notNull().defaultTo(0); //مبلغ
            table.json('imageUrl');
            table.string('description');
            table.string('treasuryType').notNull();
            table.string('documentType').notNull();

            table.boolean('isCompleted').defaultTo(true);
            table.string('journalId');
            table
                .foreign('journalId')
                .references('id')
                .inTable('journals')
                .onDelete('RESTRICT');
            table.string('receiveId');

        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('treasury')
};
