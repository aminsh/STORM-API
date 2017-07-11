"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    TagRepository = require('../data/repository.tag'),
    TagQuery = require('../queries/query.tag');


router.route('/')
    .get(async((req, res) => {
        let tagQuery = new TagQuery(req.branchId),
            result = await(tagQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let cmd = req.body,
            tagRepository = new TagRepository(req.branchId),
            entity = {title: cmd.title};

        await(tagRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});
    }));

module.exports = router;
