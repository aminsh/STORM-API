"use strict";

exports.up = function(knex, Promise) {
    return knex.schema.table('branches', table => table.boolean('is_archive'));
};

exports.down = function(knex, Promise) {

    return knex.schema.table('branches', table => table.dropColumn('is_archive'));
};
