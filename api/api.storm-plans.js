"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    express = require('express'),
    knex = instanceOf('knex'),
    Enums = instanceOf("Enums");

router.route('/')
    .get(async(function (req, res) {

        let result = await(get());

        res.send(result);
    }));


router.route('/:category')
    .get(async(function (req, res) {

        let result = await(get({category: req.params.category}));

        res.send(result);
    }));


function get(where) {

    let query = knex.select('*').from('storm_plans');

    if (where)
        query.where(where);

    query.orderBy('order');

    let result = await(query);

    result.forEach(item => {

        item.featuresDisplay = {
            api: item.features.api.map(f => Enums.Features().getDisplay(f)),
            dashboard: item.features.dashboard.map(f => Enums.Features().getDisplay(f)),
        };
    });

    return result;
}

module.exports = router;


