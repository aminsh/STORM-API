"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    string = require('../utilities/string'),
    translate = require('../services/translateService'),
    DetailAccountRepository = require('../data/repository.detailAccount'),
    DetailAccountQuery = require('../queries/query.detailAccount');

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.cookies['branch-id']),
            result = detailAccountQuery.getAllFunds(req.query);
        res.json(result);
    }))
    .post(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.cookies['branch-id']),
            cmd = req.body,
            entity = {
                code: cmd.code,
                title: cmd.title,
                detailAccountType: 'fund'
            };

        entity = await(detailAccountRepository.create(entity));

        res.json({isValid: true, returnValue: {id: entity.id}});

    }));

router.route('/:id')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.cookies['branch-id']),
            result = detailAccountQuery.getById(req.params.id);
        res.json(result);
    }))
    .put(async((req, res) => {
        let detailAccountRepository = new DetailAccountRepository(req.cookies['branch-id']),
            cmd = req.body,
            entity = await(detailAccountRepository.findById(req.params.id));

        entity.code = cmd.code;
        entity.title = cmd.title;

        await(detailAccountRepository.update(entity));

        res.json({isValid: true});
    }));


module.exports = router;