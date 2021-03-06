"use strict";

const tables = [
    'chequeCategories',
    'cheques',
    'detailAccounts',
    'dimensionCategories',
    'dimensions',
    'fiscalPeriods',
    'generalLedgerAccounts',
    'journalLines',
    'journalTemplates',
    'journals',
    'subsidiaryLedgerAccounts',
    'tags',
    'users',
    'sales',
    'saleLines',
    'products'
];

exports.up = function (knex, Promise) {
    return Promise.all(
        tables.asEnumerable()
            .select(t => knex.schema.table(t, table => table.string('branchId')))
            .toArray()
    );
};

exports.down = function (knex, Promise) {
    return Promise.all(tables.asEnumerable()
        .select(t => knex.schema.table(t, table => table.dropColumn('branchId')))
        .toArray()
    );
};
