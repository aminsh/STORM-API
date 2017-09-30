"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('invoices', table => {
         table.string('ofInvoiceId');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('ofInvoiceId');
        });
};
