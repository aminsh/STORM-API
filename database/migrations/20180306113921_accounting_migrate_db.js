"use strict";

exports.up = function (knex, Promise) {
    return knex.schema
        .alterTable('journalLines', function (table) {
            table.double('debtor', 14, 10).alter();
            table.double('creditor', 14, 10).alter();
        })
        .alterTable('products', function (table) {
            table.double('salePrice', 14, 10).alter();
        })
        .alterTable('invoices', function (table) {
            table.double('discount', 14, 10).alter();
        })
        .alterTable('invoiceLines', function (table) {
            table.double('discount', 14, 10).alter();
            table.double('unitPrice', 14, 10).alter();
            table.double('vat', 14, 10).alter();
            table.double('quantity', 14, 10).alter();
        })
        .alterTable('payments', function (table) {
            table.double('amount', 14, 10).alter();
        })
        .alterTable('cheques', function (table) {
            table.double('amount', 14, 10).alter();
        });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .alterTable('journalLines', function (table) {
            table.float('debtor').alter();
            table.float('creditor').alter();
        })
        .alterTable('products', function (table) {
            table.float('salePrice').alter();
        })
        .alterTable('invoices', function (table) {
            table.float('discount').alter();
        })
        .alterTable('invoiceLines', function (table) {
            table.float('discount').alter();
            table.float('unitPrice').alter();
            table.float('vat').alter();
            table.float('quantity').alter();
        })
        .alterTable('payments', function (table) {
            table.float('amount').alter();
        })
        .alterTable('cheques', function (table) {
            table.float('amount').alter();
        });
};
