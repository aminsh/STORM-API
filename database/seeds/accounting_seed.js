"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await');

exports.seed = async(function (knex, Promise) {
    const branches = await(knex.select('id').from('branches')),
        oldAccountGroups = [
            {key: '1', display: 'دارایی ها'},
            {key: '2', display: 'بدهی ها'},
            {key: '3', display: 'حقوق صاحبان سهام'},
            {key: '5', display: 'خرید'},
            {key: '6', display: 'فروش'},
            {key: '7', display: 'درآمدها'},
            {key: '8', display: 'هزینه ها'},
            {key: '9', display: 'سایر حساب ها'}
        ],

        data = branches.asEnumerable()
            .selectMany(b => oldAccountGroups, (b, g) => ({branchId: b.id, key: g.key, display: g.display}))
            .toArray();

    return knex.table('accountCategories').insert(data);
});