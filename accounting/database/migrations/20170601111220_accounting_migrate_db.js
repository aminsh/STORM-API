"use strict";

const enums = require('../../shared/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .table('detailAccounts', table => {
            table.string('economyCode');
            table.string('bank');
            table.string('bankBranch');
            table.string('bankAccountNumber');
            table.boolean('thisIsDefaultBankAccount');
            table.boolean('thisIsDefaultFund');
            table.enu('detailAccountType', enums.DetailAccountType().getKeys());
        })
        .createTable('subLedgerGroup', table => {
            table.string('key').primary();
            table.text('subsidiaryLedgerAccountIds');
        })
        .dropTable('detailAccountCenters');
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('detailAccounts', table => {
            table.dropColumn('economyCode');
            table.dropColumn('bank');
            table.dropColumn('bankBranch');
            table.dropColumn('bankAccountNumber');
            table.dropColumn('thisIsDefaultBankAccount');
            table.dropColumn('thisIsDefaultFund');
            table.dropColumn('detailAccountType');
        })
        .dropTable('subLedgerGroup')
        .createTable('detailAccountCenters', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('subsidiaryLedgerAccountId');
            table
                .foreign('subsidiaryLedgerAccountId')
                .references('id')
                .inTable('subsidiaryLedgerAccounts')
                .onDelete('CASCADE');

            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('CASCADE');
            table.string('branchId');
        });
};
