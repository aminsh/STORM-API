"use strict";

exports.up = function(knex, Promise) {

    return knex.schema
        .table('storm_plans', table => {
            table.integer('order');
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('storm_plans', table => {
            table.dropColumn('order');
        });
};
