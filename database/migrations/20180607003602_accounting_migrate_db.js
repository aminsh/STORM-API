"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .table('storm_gifts', table => {
            table.integer('discountRate').alter();
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('storm_gifts', table => {
            table.string('discountRate').alter();
        });
};
