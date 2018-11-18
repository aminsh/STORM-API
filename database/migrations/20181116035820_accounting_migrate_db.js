"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .table('settings', table => {
            table.string('productAccountLevel');
            table.string('stockAccountLevel');
        })
        .table('products', table => table.string('accountId'))
        .table('stocks', table => table.string('accountId'));
};

exports.down = function (knex, Promise) {

    return knex.schema
        .table('settings', table => {
            table.dropColumn('productAccountLevel');
            table.dropColumn('stockAccountLevel');
        })
        .table('products', table => table.dropColumn('accountId'))
        .table('stocks', table => table.dropColumn('accountId'));
};
