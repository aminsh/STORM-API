"use strict";

exports.up = (knex, Promise) => {

    return knex.schema
        .createTable('documentPages', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('title');
            table.string('pageContent');
            table.string('parentId');
        })
        .table('documentPages', table => {
            table
                .foreign('parentId')
                .references('id')
                .inTable('documentPages')
                .onDelete('CASCADE');
        });

};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('documentPages');
};
