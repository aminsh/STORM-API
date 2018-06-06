"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .table('storm_gifts', table => {
            table.integer('discountRate').alter();
            table.integer('duration');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('storm_gifts', table => {
            table.string('discountRate').alter();
            table.dropColumn('duration');
        });
};
