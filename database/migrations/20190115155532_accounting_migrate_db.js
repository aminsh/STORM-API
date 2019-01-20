"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('storm_gifts', table => {
            table.boolean('usable');
            table.boolean('unlimited');
            table.boolean('isActive');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('storm_gifts', table => {
            table.dropTable('usable');
            table.dropTable('unlimited');
            table.dropTable('isActive');
        });
};
