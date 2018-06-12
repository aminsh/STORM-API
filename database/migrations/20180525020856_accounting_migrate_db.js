"use strict";

exports.up = function(knex, Promise) {
    return knex.schema
        .raw('ALTER TABLE "branches" DROP CONSTRAINT IF EXISTS "branches_status_check";');
};

exports.down = function(knex, Promise) {
  
};
