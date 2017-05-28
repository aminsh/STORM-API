"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod'),
    EventEmitter = require('../services/shared').service.EventEmitter,
    Memory = require('../services/shared').service.Memory,
    branchQuery = require('../../../storm/server/features/branch/branch.query'),
    knex = require('knex'),
    config = require('../config');


module.exports = async((req, res, next) => {

    let branchId = req.cookies['branch-id'];

    if(!branchId) return next();

    /*let knexInstance = Memory.get(`context.${branchId}`);

    if (!knexInstance) {
        let branch = await(branchQuery.getById(branchId)),
            dbConnection = {
                client: 'pg',
                connection: branch.accConnection,
                debug: config.env == 'development'
            };

        knexInstance = knex(dbConnection);

        Memory.set(`context.${branchId}`, knexInstance);
    }*/

    let user = req.user,
        currentPeriod = req.cookies['current-period'];

    EventEmitter.emit('on-user-created', {id: user.id, name: user.name}, req);

    if (currentPeriod == null || currentPeriod == 0 || isNaN(currentPeriod)) {
        let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']),
            maxId = await(fiscalPeriodQuery.getMaxId());
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
    }

    if (!req.cookies['current-mode'])
        res.cookie('current-mode', 'create');

    next();
});


