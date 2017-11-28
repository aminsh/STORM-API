"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('settings', table => {
         table.json('events');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('settings', table => {
            table.dropColumn('events');
        });
};
