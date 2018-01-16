"use strict";

exports.up = function(knex, Promise) {
  return knex.schema
      .table("userInBranches", table => {
          table.boolean('isOwner');
      })
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table("userInBranches", table => {
            table.dropColumn('isOwner');
        })
};
