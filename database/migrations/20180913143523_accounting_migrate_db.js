"use strict";

exports.up = function(knex, Promise) {

    return knex.schema.table('products_inventory', table => {
        table.string('fiscalPeriodId');

        table
            .foreign('fiscalPeriodId')
            .references('id')
            .inTable('fiscalPeriods')
            .onDelete('CASCADE');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('products_inventory', table => {
        table.dropColumn('fiscalPeriodId');
    });
};
