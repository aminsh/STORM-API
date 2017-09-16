"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('stocks', table => {
            table.string('address');
        })
        .table('settings', table => {
            table.boolean('canCreateSaleOnNoEnoughInventory');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('stocks', table => {
            table.dropColumn('address');
        })
        .table('settings', table => {
            table.dropColumn('canCreateSaleOnNoEnoughInventory');
        });
};
