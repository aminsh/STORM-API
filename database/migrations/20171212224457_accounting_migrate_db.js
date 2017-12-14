"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.string('inputId');
            table.string('outputId');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.dropColumn('inputId');
            table.dropColumn('outputId');
        });
};
