"use strict";

exports.up = function(knex, Promise) {

    return knex.schema
        .table('users', table => {
            table.boolean('isActiveMobile');
            table.boolean('isActiveEmail');
        });
};

exports.down = function(knex, Promise) {

    return knex.schema
        .table('users', table => {
            table.dropColumn('isActiveMobile');
            table.dropColumn('isActiveEmail');
        });
};
