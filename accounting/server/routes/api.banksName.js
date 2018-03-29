"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    BanksNameQuery = require('../queries/query.banksName');

router.route('/')
    .get(async((req, res) => {
        let banksNameQuery = new BanksNameQuery(req.branchId),
            result = await(banksNameQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send("banksNameCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

module.exports = router;