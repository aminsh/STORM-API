"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod');


module.exports = async((req, res, next) => {
    if (!req.isAuthenticated())
        return next();

    let currentPeriod = req.cookies['current-period'];

    if (currentPeriod == null || currentPeriod == 0) {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']),
            maxId = await(fiscalPeriodQuery.getMaxId());
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
    }

    if (!req.cookies['current-mode'])
        res.cookie('current-mode', 'Create');

    next();
});


