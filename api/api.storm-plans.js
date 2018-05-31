"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    knex = instanceOf('knex');

router.route('/')
    .get(async(function (req, res) {

        let result = await(
            knex.select('*').from('storm_plans')
                .orderBy('name')
        );

        res.send(result);
    }));


router.route('/:category')
    .get(async(function (req, res) {

        let result = await(
            knex.select('*').from('storm_plans').where({category: req.params.category})
                .orderBy('name')
        );

        res.send(result);
    }));

module.exports = router;


