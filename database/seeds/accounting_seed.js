"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../dist/Constants/enums'),
    Uuid = require('uuid-token-generator'),
    uuid = new Uuid,
    idGenerate = () => uuid.generate();

exports.seed = async(function (knex, Promise) {

    let data = await(knex.select('*')
        .from(function () {
            this.select('id', 'quantity', 'unitPrice', 'discount', 'vat', knex.raw('ROUND((100 * vat)/((quantity * "unitPrice")-discount)) as rate'))
                .from('invoiceLines')
                .as('base');
        })
        .where('rate', 9));

    data.forEach(item => {
        let obj = {vat: 0, tax: 0},
            amount = (item.quantity * item.unitPrice) - item.discount;

        obj.tax = amount * 6 / 100;
        obj.vat = amount * 3 / 100;

        await(knex('invoiceLines').where({id: item.id}).update(obj));
    });

    let notHaveVat = await(knex.select('*')
        .from(function () {
            this.select('id', 'quantity', 'unitPrice', 'discount', 'vat', knex.raw('ROUND((100 * vat)/((quantity * "unitPrice")-discount)) as rate'))
                .from('invoiceLines')
                .as('base');
        })
        .where('rate', '!=', 9)
        .orWhereNull('rate'));

    await(knex('invoiceLines').whereIn('id', notHaveVat.map(item => item.id)).update({tax: 0}));

    let settingsIs9Vat = await(knex.from('settings').where({vat: 9}));

    await(knex('settings').whereIn('id', settingsIs9Vat.map(item=> item.id)).update({vat: 3, tax: 6}));


});

