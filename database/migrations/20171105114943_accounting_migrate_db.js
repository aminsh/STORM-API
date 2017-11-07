"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('branches', table => {
         table.string('province');
         table.string('city');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.dropColumn('province');
            table.dropColumn('city');
        });
};
