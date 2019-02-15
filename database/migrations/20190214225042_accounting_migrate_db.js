"use strict";

exports.up = function(knex, Promise) {
    return knex.schema.table('journalGenerationTemplates', table => {
        table.renameColumn('sourceType', 'model');
    })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('journalGenerationTemplates', table => {
        table.renameColumn('model', 'sourceType');
    })
};
