"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('branches', table => {
         table.string('nationalCode');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.dropColumn('nationalCode');
        });
};
