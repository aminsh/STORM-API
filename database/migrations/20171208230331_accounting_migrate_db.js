"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.renameColumn('saleChanges', 'saleCharges');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.renameColumn('saleCharges', 'saleChanges');
        });
};
