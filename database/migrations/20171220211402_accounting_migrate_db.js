"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table("userInBranches", table => {
            table.string('token');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table("userInBranches", table => {
            table.dropColumn('token');
        });
};
