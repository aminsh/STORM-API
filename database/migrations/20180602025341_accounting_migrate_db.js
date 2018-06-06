"use strict";

exports.up = function (knex, Promise) {

    return knex.schema
        .table('branches', table => {
            table.boolean('isProtected');
            table.boolean('isUnlimited');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.dropColumn('isProtected');
            table.dropColumn('isUnlimited');
        });
};
