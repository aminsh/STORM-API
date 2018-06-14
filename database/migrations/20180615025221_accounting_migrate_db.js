"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('storm_orders', table => table.integer('vat'));
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('storm_orders', table => table.dropColumn('vat'));
};
