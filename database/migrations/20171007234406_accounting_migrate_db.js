"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .raw('ALTER TABLE "generalLedgerAccounts" DROP CONSTRAINT "generalLedgerAccounts_groupingType_check";')
};

exports.down = function(knex, Promise) {
  
};
