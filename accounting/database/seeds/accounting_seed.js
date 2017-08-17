"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    guid = require('../../../shared/utilities/guidService');

exports.seed = async(function (knex, Promise) {
    await (knex('plans').insert([{
        id: guid.new(),
        title: 'پلان رایگان',
        description: 'تست توضیحات',
        cost: 0,
        duration: 31,
        factorsCount: 100,
        gift: {
            discountPercent: 0,
            additionalFactors: 0
        },
    },
    {
        id: guid.new(),
        title: 'پلان برنزی',
        description: 'تست توضیحات',
        cost: 500000,
        duration: 31,
        factorsCount: 200,
        gift: {
            discountPercent: 0,
            additionalFactors: 0
        },
    },
    ]));
});