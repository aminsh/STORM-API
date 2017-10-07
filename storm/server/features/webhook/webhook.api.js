"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    knex = instanceOf('knex'),
    kendoQueryResolve = instanceOf('kendoQueryResolve');

router.route('/deliveries')
    .get(async((req, res) => {
        const query = knex.select('*').from('webhookDeliveries')
            .where('branchId', req.cookies['branch-id']),

            result = await(kendoQueryResolve(query, req.query, item => item));

        res.json(result);
    }));

module.exports = router;
