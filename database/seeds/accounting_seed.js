"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.seed = async(function (knex, Promise) {

    const invoices = await(knex.select('*').from('invoices').where('invoiceType', 'sale'));

    invoices.forEach(item => {
        let updatedInvoice = {
            invoiceStatus:
                item.invoiceStatus === 'draft' ? undefined : 'confirmed'
        };

        await(knex('invoices').where('id', item.id).update(updatedInvoice));
    })
});