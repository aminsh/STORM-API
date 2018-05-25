"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    BankAndFundQuery = require('../queries/query.bankAndFund');

router.route('/summary')
    .get(async((req, res) => {
        let bankAndFundQuery = new BankAndFundQuery(req.branchId, req.user.id),
            result = await(bankAndFundQuery.getSummary(req.fiscalPeriodId));

        res.json(result);
    }));

router.route('/')
    .get(async((req, res)=> {
        let bankAndFundQuery = new BankAndFundQuery(req.branchId, req.user.id),
            result = await(bankAndFundQuery.getAll(req.fiscalPeriodId,req.query));

        res.json(result);
    }));

module.exports = router;