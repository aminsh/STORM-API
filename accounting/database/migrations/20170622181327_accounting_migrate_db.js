"use strict";

const enums = require('../../shared/enums');

exports.up = function(knex, Promise) {
  return knex.schema
      .table('users', table => {
          table.string('email');
          table.string('password');
          table.enu('state', ['pending', 'active']);
          table.text('token');
          table.dropColumn('branchId');
          table.text('googleToken');
          table.string('image');
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
      })
      .createTable('branches', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.string('id').primary();
          table.string('name');
          table.text('logo');
          table.string('phone');
          table.string('address');
          table.string('ownerId');
          table
              .foreign('ownerId')
              .references('id')
              .inTable('users')
              .onDelete('SET NULL');
          table.enu('status', enums.BranchStatus().getKeys());
          table.text('apiKey');
          table.string('webSite');
          table.string('mobile');
          table.string('ownerName');
          table.string('nationalCode');
          table.string('postalCode');
      })
      .createTable('userInBranches', table => {
          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt').defaultTo(knex.fn.now());
          table.increments('id').primary();
          table.enu('state', ['active', 'inactive']);
          table.enu('app', ['accounting']);
          table.string('branchId');
          table.string('userId');
      });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .table('users', table => {
            table.dropColumn('email');
            table.dropColumn('password');
            table.dropColumn('state', ['pending', 'active']);
            table.dropColumn('token');
            table.string('branchId');
        })
        .dropTable('branches')
        .dropTable('userInBranches');
};
