"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('stocks', table => {
            table.string('address');
        })
        .table('settings', table => {
            table.boolean('canCreateSaleOnNoEnoughInventory');
            table.string('productOutputCreationMethod');
            table.string('stockId');
            table.boolean('canSaleGenerateAutomaticJournal');
        })
        .createTable('journalGenerationTemplates', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('branchId');
            table.string('title');
            table.string('sourceType');
            table.json('data');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('stocks', table => {
            table.dropColumn('address');
        })
        .table('settings', table => {
            table.dropColumn('canCreateSaleOnNoEnoughInventory');
            table.dropColumn('productOutputCreationMethod');
            table.dropColumn('canSaleGenerateAutomaticJournal');
        })
        .dropTable('journalGenerationTemplates');
};
