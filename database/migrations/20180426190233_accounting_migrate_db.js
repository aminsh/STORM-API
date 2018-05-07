"use strict";

exports.up = function(knex, Promise) {

    return knex.schema.table('banksName' , table => {
        table.string('createdById');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('banksName' , table => {
        table.dropColumn('createdById');
    });
};
