"use strict";

exports.up = function(knex, Promise) {

    return knex.schema.table('journalGenerationTemplates', table => table.json('fields'));
};

exports.down = function(knex, Promise) {

    return knex.schema.table('journalGenerationTemplates', table => table.dropColumn('fields'));
};
