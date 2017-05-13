"use strict";

const enums = require('../../server/constants/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .table('generalLedgerAccounts', table => {
            table.enu('groupingType', enums.AccountGroupingType().getKeys())
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('generalLedgerAccounts', table => {
           table.dropColumn('groupingType');
        });
};
