"use strict";

exports.up = function (knex, Promise) {
    return knex.schema.table('stocks', table => {
        table.string('subsidiaryLedgerAccountId');
        table
            .foreign('subsidiaryLedgerAccountId')
            .references('id')
            .inTable('subsidiaryLedgerAccounts')
            .onDelete('RESTRICT');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('stocks', table => {
        table.dropColumn('subsidiaryLedgerAccountId');
    });
};
