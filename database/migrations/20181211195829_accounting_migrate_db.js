"use strict";

exports.up = function (knex, Promise) {

    return knex.schema.table('product_price_list_lines', table => {

        table.string('priceListId');
        table
            .foreign('priceListId')
            .references('id')
            .inTable('product_price_list')
            .onDelete('CASCADE');
    });
};

exports.down = function (knex, Promise) {

    return knex.schema.table('product_price_list_lines', table => {

        table.dropColumn('priceListId');
    })
};
