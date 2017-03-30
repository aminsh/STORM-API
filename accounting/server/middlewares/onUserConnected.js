"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    Memory = require('../services/shared').service.Memory,
    BranchQuery = require('../../../storm/server/features/branch/branch.query'),
    branchQuery = new BranchQuery(),
    knex = require('knex');


module.exports = async((req, res, next) => {

    let branchId = req.cookies['branch-id'],
        knexInstance = Memory.get(`context.${branchId}`);

    if (!knexInstance) {
        let branch = await(branchQuery.getById(branchId));

        knexInstance = knex(branch.accConnection);

        Memory.set(`context.${branchId}`, knexInstance);
    }

    let user = req.user,
        currentPeriod = req.cookies['current-period'];

    EventEmitter.emit('on-user-created', {id: user.id, name: user.name}, req);

    if (currentPeriod == null || currentPeriod == 0) {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']),
            maxId = await(fiscalPeriodQuery.getMaxId());
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
    }

    if (!req.cookies['current-mode'])
        res.cookie('current-mode', 'create');

    next();
});

