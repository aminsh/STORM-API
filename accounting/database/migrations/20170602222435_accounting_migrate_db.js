"use strict";

const enums = require('../../shared/enums');

exports.up = function (knex, Promise) {
    return knex.schema
        .dropTable('saleLines')
        .dropTable('sales')
        .dropTable('purchaseLines')
        .dropTable('purchases')
        .createTable('invoices', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('number');
            table.string('date');
            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('CASCADE');
            table.string('description');
            table.string('referenceId');
            table.string('journalId');
            table
                .foreign('journalId')
                .references('id')
                .inTable('journals')
                .onDelete('SET NULL');
            table.enu('invoiceType', enums.InvoiceType().getKeys());
            table.enu('invoiceStatus', enums.InvoiceStatus().getKeys());
            table.string('branchId');
        })
        .createTable('invoiceLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('productId');

            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');

            table.string('description');
            table.string('invoiceId');

            table
                .foreign('invoiceId')
                .references('id')
                .inTable('invoices')
                .onDelete('CASCADE');

            table.float('quantity');
            table.float('unitPrice');
            table.float('vat');
            table.float('discount');
            table.string('branchId');
        })
        .createTable('payments', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('number');
            table.string('date');
            table.string('journalLineId');
            table
                .foreign('journalLineId')
                .references('id')
                .inTable('journalLines')
                .onDelete('SET NULL');

            table.string('invoiceId');

            table
                .foreign('invoiceId')
                .references('id')
                .inTable('invoices')
                .onDelete('CASCADE');

            table.float('amount');
            table.enu('receivableType', enums.ReceivableType().getKeys());
            table.string('bankName');
            table.string('bankBranch');

            table.string('chequeId');
            table
                .foreign('chequeId')
                .references('id')
                .inTable('cheques')
                .onDelete('SET NULL');
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTable('payments')
        .dropTable('invoiceLines')
        .dropTable('invoices')
        .dropTable('payments')
        .createTable('purchases', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.integer('number');
            table.string('date');
            table.string('detailAccountId');
            table
                .foreign('detailAccountId')
                .references('id')
                .inTable('detailAccounts')
                .onDelete('CASCADE');
            table.string('description');
            table.string('referenceId');
            table.string('branchId');
        })
        .createTable('purchaseLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('productId');

            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');

            table.string('purchaseId');

            table
                .foreign('purchaseId')
                .references('id')
                .inTable('purchases')
                .onDelete('CASCADE');

            table.float('quantity');
            table.float('unitPrice');
            table.float('tax');
            table.float('vat');
            table.float('discount');
            table.string('branchId');
        })
        .createTable('sales', table => {
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
        table.string('id').primary();
        table.integer('number');
        table.string('date');
        table.string('detailAccountId');
        table
            .foreign('detailAccountId')
            .references('id')
            .inTable('detailAccounts')
            .onDelete('CASCADE');
        table.string('description');
        table.string('referenceId');
    })
        .createTable('saleLines', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
            table.string('id').primary();
            table.string('productId');

            table
                .foreign('productId')
                .references('id')
                .inTable('products')
                .onDelete('CASCADE');

            table.string('saleId');

            table
                .foreign('saleId')
                .references('id')
                .inTable('sales')
                .onDelete('CASCADE');

            table.float('quantity');
            table.float('unitPrice');
            table.float('tax');
            table.float('vat');
            table.float('discount');
        });
};
