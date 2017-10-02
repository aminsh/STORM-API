"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('invoices', table => {
         table.string('ofInvoiceId');
      })
      .table('detailAccounts', table => {
         table.json('contacts');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('ofInvoiceId');
        })
        .table('detailAccounts', table => {
            table.dropColumn('contacts');
        });
};
