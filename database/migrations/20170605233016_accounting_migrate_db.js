"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('fiscalPeriods', table => {
          table.string('title');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('fiscalPeriods', table => {
            table.dropColumn('title');
        });};
