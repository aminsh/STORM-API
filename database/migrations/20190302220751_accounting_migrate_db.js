"use strict";

exports.up = function(knex, Promise) {
    return knex.schema.table('invoice_types', table => {
        table.string('returnJournalGenerationTemplateId');

        table
            .foreign('returnJournalGenerationTemplateId')
            .references('id')
            .inTable('journalGenerationTemplates')
            .onDelete('SET NULL');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('invoice_types', table => {
        table.dropColumn('returnJournalGenerationTemplateId');
    });
};
