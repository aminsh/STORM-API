"use strict";

exports.up = function (knex, Promise) {

    return knex.schema.table('users', table => table.dropColumn('googleToken'));
};

exports.down = function (knex, Promise) {

    return knex.schema.table('users', table => table.string('googleToken'));
};
