"use strict";

exports.up = function(knex, Promise) {

    return knex.schema
        .raw('ALTER TABLE "detailAccounts" DROP CONSTRAINT IF EXISTS "detailAccounts_detailAccountType_check";')
};

exports.down = function(knex, Promise) {
  
};
