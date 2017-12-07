"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .table('generalLedgerAccounts', table => {
            table.dropColumn('balanceType');
        })
        .table('subsidiaryLedgerAccounts', table => {
            table.text('balanceType');
        })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('generalLedgerAccounts', table => {
            table.string('balanceType');
        })
        .table('subsidiaryLedgerAccounts', table => {
            table.dropColumn('balanceType');
        });
};