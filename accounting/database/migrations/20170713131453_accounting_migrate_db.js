"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('journalTemplates', table => {
            table.dropColumn('data');
            table.string('journalId');

            table
                .foreign('journalId')
                .references('id')
                .inTable('journals')
                .onDelete('CASCADE');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('journalTemplates', table => {
            table.json('data');
            table.dropColumn('journalId');
        });
};
