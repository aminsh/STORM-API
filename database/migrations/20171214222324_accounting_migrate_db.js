"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.boolean('fixedQuantity');
            table.boolean('fixedAmount');
            table.boolean('shipped');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.dropColumn('fixedQuantity');
            table.dropColumn('fixedAmount');
            table.dropColumn('shipped');
        });
};
