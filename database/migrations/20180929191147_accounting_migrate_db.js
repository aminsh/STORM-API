"use strict";

exports.up = function(knex, Promise) {

    return knex.schema.table('detailAccountCategories', table => table.string('createdById'));
};

exports.down = function(knex, Promise) {
    return knex.schema.table('detailAccountCategories', table => table.dropColumn('createdById'));
};
