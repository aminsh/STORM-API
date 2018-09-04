"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('journalGenerationPurpose', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('branchId');
            table
                .foreign('branchId')
                .references('id')
                .inTable('branches')
                .onDelete('RESTRICT');
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('SET NULL');

            table.string('key');
            table.string('title');

            table.string('subsidiaryLedgerAccountId');
            table
                .foreign('subsidiaryLedgerAccountId')
                .references('id')
                .inTable('subsidiaryLedgerAccounts')
                .onDelete('SET NULL');

            table.json('purposesFeatures');
        })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('journalGenerationPurpose');
};
