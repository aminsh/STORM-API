"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('accountCategories', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.increments('id').primary();
          table.string('branchId');
          table.string('key');
          table.string('display');
          table.string('postingType');
      });
};

exports.down = function(knex, Promise) {
  return knex.schema
      .dropTable('accountCategories');
};
