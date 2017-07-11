"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('detailAccounts', table => {
          table.string('referenceId');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('detailAccounts', table => {
            table.dropColumn('referenceId');
        });
};
