"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('users', table => {
          table.string('role');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('users', table => {
            table.dropColumn('role');
        });
};
