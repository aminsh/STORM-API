"use strict";

const async = require('asyncawait/async'),
    /**
     * @type {BranchService} */
    BranchService = instanceOf('BranchService'),

    parseFiscalPeriod = require('../../../api/parse.fiscalPeriod');

module.exports = async(function (req, res, next) {

    const branchKey = req.cookies['BRANCH-KEY'];

    if (!branchKey)
        return branchIsNotValidAction(req, res);

    let state = BranchService.findByToken(branchKey);

    if (!(state && state.isActive))
        return branchIsNotValidAction(res, res);

    req.branchId = state.branchId;
    req.mode = 'create';

    parseFiscalPeriod(req);

    res.cookie('current-period', req.fiscalPeriodId);

    return next()

});

function branchIsNotValidAction(req, res) {
    const url = `/acc/branches`;

    if (req.xhr)
        return res.status(401).send('branch is not valid');

    return res.redirect(url);
}