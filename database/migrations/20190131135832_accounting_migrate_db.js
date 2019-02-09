"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .table('detailAccounts', table => {
            table.dropColumn('personRoles');
            table.boolean('isMarketer');
            table.integer('marketerCommissionRate');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('detailAccounts', table => {
            table.json('personRoles');
            table.dropColumn('isMarketer');
            table.dropColumn('marketerCommissionRate');
        });
};
