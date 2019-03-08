"use strict";

exports.up = function(knex, Promise) {
  return knex.schema.table('settings', table => {
      table.boolean('canPurchaseGenerateAutomaticInput');
      table.boolean('canEnterAmountBiggerThanInvoiceAmountOnPayment');

  })
};

exports.down = function(knex, Promise) {
    return knex.schema.table('settings', table => {
        table.dropColumn('canPurchaseGenerateAutomaticInput');
        table.dropColumn('canEnterAmountBiggerThanInvoiceAmountOnPayment');
    })
};
