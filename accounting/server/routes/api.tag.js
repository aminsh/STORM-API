"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    TagRepository = require('../data/repository.tag'),
    TagQuery = require('../queries/query.tag');


router.route('/')
    .get(async((req, res) => {
        let tagQuery = new TagQuery(req.cookies['branch-id']),
            result = await(tagQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let tag = req.body,
            tagRepository = new TagRepository(req.cookies['branch-id']);

        tag = await(tagRepository.create(tag));

        res.json({isValid: true, returnValue: {id: tag.id}});
    }));

module.exports = router;
