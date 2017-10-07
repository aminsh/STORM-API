"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('inventories', table => {
            table.string('ioType');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('inventories', table => table.dropColumn('ioType'));
};
