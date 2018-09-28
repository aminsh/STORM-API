"use strict";


exports.up = function(knex, Promise) {

    return knex.schema.table('inventories', table => {
        table.boolean('priceManuallyEntered').defaultTo(false);
    });
};

exports.down = function(knex, Promise) {

    return knex.schema.table('inventories', table => {
        table.dropColumn('priceManuallyEntered');
    });
};

