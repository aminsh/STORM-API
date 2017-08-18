"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('detailAccountCategories', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('branchId');

            table.string('title');
            table.text('subsidiaryLedgerAccountIds');
        })
        .table('detailAccounts', table => {
            table.string('mobile');
            table.string('accountNumber');
            table.string('accountCartNumber');
            table.text('detailAccountCategoryIds')
        })
        .dropTable('subLedgerGroup')
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('detailAccountCategories')
        .table('detailAccounts', table => {
            table.dropColumn('mobile');
            table.dropColumn('accountNumber');
            table.dropColumn('accountCartNumber');
            table.dropColumn('detailAccountCategoryIds')
        })
        .createTable('subLedgerGroup', table => {
            table.string('key').primary();
            table.text('subsidiaryLedgerAccountIds');
        });
};
