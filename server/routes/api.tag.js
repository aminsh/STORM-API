"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    TagRepository = require('../data/repository.tag'),
    TagQuery = require('../queries/query.tag');


router.route('/').get(async((req, res) => {
    let tagQuery = new TagQuery(req.cookies['branch-id']),
        result = await(tagQuery.getAll(req.query));
    res.json(result);
}));

module.exports = router;
