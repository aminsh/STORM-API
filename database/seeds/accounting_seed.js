"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.seed = async(function (knex, Promise) {

    const invoices = await(knex.select('*').from('invoices').where('invoiceType', 'sale'));

    invoices.forEach(item => {

        if(item.invoiceStatus === 'draft')
            return;

        await(knex('invoices').where('id', item.id).update({invoiceStatus: 'confirmed'}));
    })
});