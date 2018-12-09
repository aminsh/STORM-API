"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .table('product_price_list', table => table.string('createdById'))
        .table('product_price_list_lines', table => table.string('createdById'));
};

exports.down = function (knex, Promise) {

    return knex.schema
        .table('product_price_list', table => table.dropColumn('createdById'))
        .table('product_price_list_lines', table => table.dropColumn('createdById'));
};
