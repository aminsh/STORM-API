"use strict";

require('../../server/utilities/array.prototypes');

const enums = require('../../server/constants/enums');

exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('fiscalPeriods', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('minDate');
            table.string('maxDate');
            table.boolean('isClosed');
        })

        .createTable('users', table => {
            table.string('id').primary();
            table.string('name');
        })

        .createTable('banks', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('title');
        })

        .createTable('detailAccounts', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('code');
            table.string('title');
            table.string('description');
            table.boolean('isActive');
        })

        .createTable('chequeCategories', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.integer('totalPages');
            table.integer('firstPageNumber');
            table.integer('lastPageNumber');
            table.string('receivedOn');
            table.boolean('isClosed');
        })

        .createTable('generalLedgerAccounts', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('code');
            table.string('title');
            table.string('description');
            table.enu('balanceType', enums.AccountBalanceType().getKeys());
            table.enu('postingType', enums.AccountPostingType().getKeys());
            table.boolean('isActive');
        })

        .createTable('subsidiaryLedgerAccounts', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('code');
            table.string('title');
            table.string('description');
            table.boolean('isBankAccount');
            table.enu('detailAccountAssignmentStatus', enums.AssignmentStatus().getKeys());
            table.enu('dimension1AssignmentStatus', enums.AssignmentStatus().getKeys());
            table.enu('dimension2AssignmentStatus', enums.AssignmentStatus().getKeys());
            table.enu('dimension3AssignmentStatus', enums.AssignmentStatus().getKeys());
            table.boolean('isActive');
        })

        .createTable('dimensionCategories', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('title');
        })

        .createTable('dimensions', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('code');
            table.string('title');
            table.string('description');
            table.boolean('isActive');
        })

        .createTable('journals', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.integer('temporaryNumber');
            table.string('temporaryDate');
            table.integer('number');
            table.string('date');
            table.string('description');
            table.enu('journalStatus', enums.JournalStatus().getKeys());
            table.enu('journalType', enums.JournalType().getKeys());
            table.boolean('isInComplete');
            table.string('attachmentFileName');
        })

        .createTable('tags', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('title');
        })

        .createTable('journalTags', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
        })

        .createTable('journalLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.integer('row');
            table.float('debtor', 8);
            table.float('creditor', 8);
            table.string('article');
        })

        .createTable('journalTemplates', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.string('title');
            table.json('data');
        })

        .createTable('cheques', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.increments('id').primary();
            table.integer('number');
            table.string('date');
            table.string('description');
            table.float('amount', 8);
            table.enu('status', enums.ChequeStatus().getKeys());
        });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTable('cheques')
        .dropTable('journalTemplates')
        .dropTable('journalLines')
        .dropTable('journalTags')
        .dropTable('tags')
        .dropTable('journals')
        .dropTable('dimensions')
        .dropTable('dimensionCategories')
        .dropTable('subsidiaryLedgerAccounts')
        .dropTable('generalLedgerAccounts')
        .dropTable('chequeCategories')
        .dropTable('detailAccounts')
        .dropTable('banks')
        .dropTable('users')
        .dropTable('fiscalPeriods');
};
