"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('settings', table => {
          table.string('id').primary();
          table.string('branchId');
          table.integer('vat');
      });
};

exports.down = function(knex, Promise) {
  return knex.schema
      .dropTable('settings');
};
