"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    BankAndFundQuery = require('../queries/query.bankAndFund');

router.route('/summary')
    .get(async((req, res) => {
        let bankAndFundQuery = new BankAndFundQuery(req.branchId),
            result = await(bankAndFundQuery.getSummary(req.fiscalPeriodId));

        res.json(result);
    }));

module.exports = router;