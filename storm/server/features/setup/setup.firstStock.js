"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    StockRepository = require('../../../../accounting/server/data/repository.stock');



module.exports = async.result(function (branchId) {

    let stockRepository = new StockRepository(branchId),
        entity = {
            title: 'انبار اصلی'
        };

    await(stockRepository.create(entity));

});

