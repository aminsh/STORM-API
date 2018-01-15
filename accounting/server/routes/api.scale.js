"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ScaleQuery = require('../queries/query.scale');

router.route('/')
    .get(async((req, res) => {
        let scaleQuery = new ScaleQuery(req.branchId),
            result = await(scaleQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {

        try {

            const id = req.container.get("CommandBus").send("scaleCreate", [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

module.exports = router;