"use strict";

exports.up = function (knex, Promise) {
    return knex.schema.table('inventoryIOTypes', table => {
        table.string('key');
        table.string('journalGenerationTemplateId');

        table
            .foreign('journalGenerationTemplateId')
            .references('id')
            .inTable('journalGenerationTemplates')
            .onDelete('SET NULL');
    })
        .createTable('invoice_types', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('branchId');
            table.string('referenceId');
            table.string('invoiceType');
            table.string('title');
            table.boolean('isDefault');
            table.string('journalGenerationTemplateId');

            table
                .foreign('journalGenerationTemplateId')
                .references('id')
                .inTable('journalGenerationTemplates')
                .onDelete('SET NULL');
        })
        .table('invoices', table => {
            table.string('typeId');

            table
                .foreign('typeId')
                .references('id')
                .inTable('invoice_types')
                .onDelete('RESTRICT');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema.table('inventoryIOTypes', table => {
        table.dropColumn('key');
        table.dropColumn('journalGenerationTemplateId');
    })
        .dropTable('invoice_types')
        .table('invoices', table => table.dropColumn('typeId'));
};
