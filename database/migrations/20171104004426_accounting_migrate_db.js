"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('branches', table => {
         table.string('fax');
         table.string('registrationNumber');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('branches', table => {
            table.dropColumn('fax');
            table.dropColumn('registrationNumber');
        });
};
