"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .createTable("inventoryIOTypes", table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.string('id').primary();
          table.string('branchId');
          table.string('createdById');
          table.string('title');
          table.enum('type', ['input', 'output']);
      });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("inventoryIOTypes");
};
