"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('productCategories', table => {
            table.string('id').primary();
            table.string('branchId');
            table.string('title');
        })
        .table('products', table => {
            table.string('categoryId');
            table
                .foreign('categoryId')
                .references('id')
                .inTable('productCategories')
                .onDelete('SET NULL');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('productCategories')
        .table('products', table => {
            table.dropColumn('categoryId');
        });
};
