"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    FiscalPeriodQuery = require('../queries/query.fiscalPeriod'),
    branchQuery = require('../../../storm/server/features/branch/branch.query'),
    knex = require('knex'),
    config = require('../config'),
    container = require('../../../application/dist/di.config').container;


module.exports = async((req, res, next) => {

    let branchId = req.cookies['branch-id'];
    req.branchId = branchId;

    if (branchId) {
        let isActiveBranch = await(branchQuery.isActive(branchId));
        /*let isBranchExpired = branchQuery.isSubscriptionExpired(branchId);

        if (isBranchExpired || !isActiveBranch)
            return res.redirect('/');*/
    }
    else return res.redirect('/profile');

    let currentPeriod = req.cookies['current-period'],
        mode = req.cookies['current-mode'];

    if (!mode) {
        res.cookie('current-mode', 'create');
        req.mode = 'create';
    } else req.mode = mode;

    let fiscalPeriodQuery = new FiscalPeriodQuery(req.cookies['branch-id']);

    if (currentPeriod == null || currentPeriod == 0) {
        setFiscalPeriodId();
    } else{
        let isFiscalPeriodValid = await(fiscalPeriodQuery.getById(currentPeriod));

        if(isFiscalPeriodValid)
            req.fiscalPeriodId = currentPeriod;

        else setFiscalPeriodId();
    }


    let childContainer = container.createChild();

    childContainer.bind("State").toConstantValue({branchId: req.branchId,fiscalPeriodId: req.fiscalPeriodId, user: req.user });

    req.container = childContainer;

    next();

    function setFiscalPeriodId() {
        let maxId = await(fiscalPeriodQuery.getMaxId());
        maxId = maxId || 0;

        res.cookie('current-period', maxId);
        req.fiscalPeriodId = maxId;
    }
});


