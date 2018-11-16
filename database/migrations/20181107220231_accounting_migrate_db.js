"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .table('inventories', table => {

            table.string('quantityStatus');
            table.string('priceStatus');

            table.dropColumn('fixedQuantity');
            table.dropColumn('fixedAmount');
        })
        .table('settings', table => {

            table.boolean('canInventoryGenerateAutomaticJournal');
        });
};

exports.down = function (knex, Promise) {

    return knex.schema
        .table('inventories', table => {

            table.dropColumn('quantityStatus');
            table.dropColumn('priceStatus');

            table.boolean('fixedQuantity');
            table.boolean('fixedAmount');
        })
        .table('settings', table => {

            table.dropColumn('canInventoryGenerateAutomaticJournal');
        })
};
