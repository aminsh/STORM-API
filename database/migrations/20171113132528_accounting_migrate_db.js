"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .table('products', table => {
            table.string('barcode');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('products', table => {
            table.dropColumn('barcode');
        });
};
