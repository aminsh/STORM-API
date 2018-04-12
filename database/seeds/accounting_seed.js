"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    enums = require('../../shared/enums');

exports.seed = async(function (knex, Promise) {

    let detailAccountsNaNCode = await(
        knex.select('id').from('detailAccounts').where('code', 'ilike', '%NaN%')
        ),
        NaNCodeIds = detailAccountsNaNCode.map(item => item.id);

    await(
        knex('detailAccounts').whereIn('id', NaNCodeIds).update({code: null})
    );
});