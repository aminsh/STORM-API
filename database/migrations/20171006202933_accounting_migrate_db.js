"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('settings', table => {
          table.json('saleCosts');
      });
};

exports.down = function(knex, Promise) {
  return knex.schema
      .table('settings', table => {
         table.dropColumn('saleCosts');
      });
};
