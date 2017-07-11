"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    knex = require('knex'),
    config = require('../config');


module.exports = async((req, res, next) => {

    let branchId = req.cookies['branch-id'];
    req.branchId = branchId;

    if (!branchId) return next();

    let currentPeriod = req.cookies['current-period'],
        mode = req.cookies['current-mode'];

    if (!mode) {
        res.cookie('current-mode', 'create');
        req.mode = 'create';
    } else req.mode = mode;

    if (currentPeriod == null || currentPeriod == 0 || isNaN(currentPeriod)) {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']),
            maxId = await(fiscalPeriodQuery.getMaxId());
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
        req.fiscalPeriodId = maxId;
    } else
        req.fiscalPeriodId = currentPeriod;

    next();
});


