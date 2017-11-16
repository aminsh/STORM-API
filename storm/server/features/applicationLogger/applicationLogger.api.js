"use strict";

const knex = instanceOf('knex'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    express = require('express'),
    router = express.Router(),
    kendoQueryResolve = instanceOf('kendoQueryResolve');

router.route('/')
    .get(async((req, res) => {

        if (!req.isAuthenticated())
            res.status(404).send();

        if (req.user.role !== 'admin')
            res.status(404).send();

        let query = knex.from(function () {
                this.select('*')
                    .from('applicationLogger')
                    .orderBy('createdAt', 'desc')
                    .as('base');
            }),

            result = await(kendoQueryResolve(query, req.query, item => item));

        res.json(result);

    }));

module.exports = router;