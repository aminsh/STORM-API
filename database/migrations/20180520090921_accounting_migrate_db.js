"use strict";
exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('roles', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('id').primary();
            table.string('branchId');
            table.string('title');
            table.bool('isAdmin');
        })
        .createTable('userInRole', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('id').primary();
            table.string('branchId').notNull();
            table.string('roleId');
            table
                .foreign('roleId')
                .references('id')
                .inTable('roles')
                .onDelete('SET NULL');
            table.string('userId');
            table
                .foreign('userId')
                .references('id')
                .inTable('users')
                .onDelete('SET NULL');
        })
        .createTable('userPermissions', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('id').primary();
            table.string('branchId').notNull();
            table.string('userId');
            table
                .foreign('userId')
                .references('id')
                .inTable('users')
                .onDelete('SET NULL');
            table.json('permissions')
        })
        .createTable('rolePermissions', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('createdById');
            table
                .foreign('createdById')
                .references('id')
                .inTable('users')
                .onDelete('RESTRICT');
            table.string('id').primary();
            table.string('branchId').notNull();
            table.string('roleId');
            table
                .foreign('roleId')
                .references('id')
                .inTable('roles')
                .onDelete('SET NULL');
            table.json('permissions')
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('roles')
        .dropTable('userInRole')
        .dropTable('userPermissions')
        .dropTable('rolePermissions')
};
