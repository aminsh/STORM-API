"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    branchQuery = require('../../../storm/server/features/branch/branch.query'),
    knex = require('knex'),
    config = require('../config');


module.exports = async((req, res, next) => {

    let branchId = req.cookies['branch-id'];
    req.branchId = branchId;

    if (branchId) {
        let isActiveBranch = await(branchQuery.isActive(branchId));

        if (!isActiveBranch)
            return res.redirect('/');
    }
    else return res.redirect('/profile');

    let currentPeriod = req.cookies['current-period'],
        mode = req.cookies['current-mode'];

    if (!mode) {
        res.cookie('current-mode', 'create');
        req.mode = 'create';
    } else req.mode = mode;

    if (currentPeriod == null || currentPeriod == 0) {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']),
            maxId = await(fiscalPeriodQuery.getMaxId());
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
        req.fiscalPeriodId = maxId;
    } else
        req.fiscalPeriodId = currentPeriod;

    next();
});


