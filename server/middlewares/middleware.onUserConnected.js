"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod');


var onUserConnected = async((req, res, next) => {
    let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']),
        currentPeriod = req.cookies['current-period'];

    if (currentPeriod == null || currentPeriod == 0) {
        let maxId = await(fiscalPeriodQuery.getMaxId());
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
    }

    if (!req.cookies['current-mode'])
        res.cookie('current-mode', 'Create');

    next();
});


module.exports = onUserConnected;

