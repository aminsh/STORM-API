"use strict";

exports.up = function(knex, Promise) {

    return knex.schema
        .table('storm_gifts', table => {
            table.dropColumn('planId');
            table.json('plans');
        });
};

exports.down = function(knex, Promise) {

    return knex.schema
        .table('storm_gifts', table => {
            table.string('planId');
            table
                .foreign('planId')
                .references('id')
                .inTable('storm_plans')
                .onDelete('SET NULL');
            table.dropColumn('plans');
        });
};
