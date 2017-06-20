"use strict";

const enums = require('../../shared/enums'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.up = function (knex, Promise) {
    let invoices;

    return knex.select('id', 'invoiceType').table('invoices')
        .then(items => {
            invoices = items;
            return knex.schema.table('invoices', table => table.dropColumn('invoiceType'))
        })
        .then(() => {
            return knex.schema.table('invoices', table => {
                table.enu('invoiceType', enums.InvoiceType().getKeys());
            });
        })
        .then(() => {
            return Promise.all(invoices.map(row => {
                return knex('invoices').where('id', row.id).update({invoiceType: row.invoiceType});
            }))
        })
        .then(() => knex.schema.table('productCategories', table => {
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(knex.fn.now());
        }))

};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('productCategories', table => {
            table.dropColumn('createdAt');
            table.dropColumn('updatedAt');
        });
};
