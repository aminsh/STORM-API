"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('invoices', table => {
         table.string('orderId');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('orderId');
        });
};
