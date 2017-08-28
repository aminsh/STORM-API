"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('detailAccounts', table => {
         table.string('province');
         table.string('city');
         table.string('postalCode');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('detailAccounts', table => {
            table.dropColumn('province');
            table.dropColumn('city');
            table.dropColumn('postalCode');
        });
};
