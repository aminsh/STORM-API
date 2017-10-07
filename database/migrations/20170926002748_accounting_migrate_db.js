"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table('settings', table => {
         table.json('subsidiaryLedgerAccounts');
         table.json('stakeholders');
      });
};

exports.down = function(knex, Promise) {
  
};
