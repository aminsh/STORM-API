"use strict";

exports.up = function(knex, Promise) {
  return knex.schema.table('branches', table => {
      table.dropColumn('accConnection');
      table.text('apiKey');
  });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('branches', table => {
        table.string('accConnection');
        table.dropColumn('apiKey');
    });
};
