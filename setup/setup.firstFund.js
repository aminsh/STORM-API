"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knex = instanceOf('knex');

module.exports = async.result(function (branchId) {

    let entity = {
        id: Utility.Guid.new(),
        title: 'صندوق اصلی',
        detailAccountType: 'fund',
        branchId
    };

    await(knex('detailAccounts').insert(entity));

});

