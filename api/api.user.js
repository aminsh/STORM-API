"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    knex = instanceOf('knex'),
    kendoQueryResolve = instanceOf('kendoQueryResolve');

router.route('/')
    .get(async(function (req, res) {
        let query = knex.from(function () {
                this.select('id', 'name', 'email', 'image').from('users').as('base');
            }),

            result = await(kendoQueryResolve(query, req.query, item => item));

        res.json(result);
    }));

module.exports = router;