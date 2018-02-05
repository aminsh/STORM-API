"use strict";

const tables = [
    'detailAccountsCategories',
    'detailAccounts',
    'dimensionCategories',
    'dimensions',
    'fiscalPeriods',
    'generalLedgerAccounts',
    'journalLines',
    'journalTemplates',
    'journals',
    'journalGenerationTemplates',
    'subsidiaryLedgerAccounts',
    'tags',
    'products',
    'productCategories',
    'scales',
    'invoices',
    'invoiceLines',
    'inventories',
    'inventoryLines',
    'payments'

];
exports.up = function(knex, Promise) {
    return Promise.all(
        tables.asEnumerable()
            .select(t => knex.schema.table(t, table => table.string('createdById')))
            .toArray()
    );
};

exports.down = function(knex, Promise) {
    return Promise.all(
        tables.asEnumerable()
            .select(t => knex.schema.table(t, table => table.dropColumn('createdById')))
            .toArray()
    );
};
