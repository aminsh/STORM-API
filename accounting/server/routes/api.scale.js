"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    ScaleRepository = require('../data/repository.scale'),
    ScaleQuery = require('../queries/query.scale');

router.route('/')
    .get(async((req, res) => {
        let scaleQuery = new ScaleQuery(req.branchId),
            result = await(scaleQuery.getAll(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        let scaleRepository = new ScaleRepository(req.branchId),
            entity = {
                title: req.body.title,
            };

        await(scaleRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});

    }));

module.exports = router;