"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('invoices', table => {
         table.string('orderId');
      })
      .table('payments',table => {
          table.string('branchId');
      })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('invoices', table => {
            table.dropColumn('orderId');
        }).table('payments',table => {
            table.dropColumn('branchId');
        });
};
