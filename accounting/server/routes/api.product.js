"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ProductQuery = require('../queries/query.product');


router.route('/').get(async((req, res) => {
    let productQuery = new ProductQuery(req.cookies['branch-id']),
        result = await(productQuery.getAll(req.query));

    res.json(result);
}));

module.exports = router;
