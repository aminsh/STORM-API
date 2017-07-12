"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    DetailAccountRepository = require('../../../../accounting/server/data/repository.detailAccount');



module.exports = async.result(function (branchId) {

    let detailAccountRepository = new DetailAccountRepository(branchId),
        entity = {
            title: 'صندوق اصلی',
            detailAccountType: 'fund'
        };

    await(detailAccountRepository.create(entity));

});

