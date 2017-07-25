"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('branches', table => {
         table.string('offCode');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.dropColumn('offCode');
        });
};
