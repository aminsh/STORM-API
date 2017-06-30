"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .table('dimensionCategories', table => {
            table.dropColumn('branchId');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('dimensionCategories', table => {
            table.string('branchId');
        });
};
