"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../shared/enums');

exports.seed = async(function (knex, Promise) {

    const invoices = await(knex.select('*').from('invoices')
        .where('invoiceType', 'purchase')
        .where('invoiceStatus', '!=', 'draft')
    );

    invoices.forEach(item => {
        let updatedInvoice = {
            invoiceStatus: 'confirmed'
        };

        await(knex('invoices').where('id', item.id).update(updatedInvoice));
    })
});