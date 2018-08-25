"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    DetailAccountQuery = require('../queries/query.detailAccount'),
    PersonQuery = require('../queries/query.person');

router.route('/:id/summary/sale/by-month')
    .get(async((req, res) => {
        let personQuery = new PersonQuery(req.branchId, req.user.id),
            result = await(personQuery.getTotalPriceAndCountByMonth(req.params.id, req.fiscalPeriodId));
        res.json(result);
    }));

router.route('/')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllPeople(req.query));
        res.json(result);
    }))
    .post(async((req, res) => {
        try {
            const id = req.container.get("CommandBus").send('personCreate', [req.body]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:personRole')
    .get(async((req, res) => {
        let detailAccountQuery = new DetailAccountQuery(req.branchId),
            result = await(detailAccountQuery.getAllPeopleWithRoleFilter(req.query, req.params.personRole));
        res.json(result);
    }));

router.route('/:id')
    .get(async((req, res) => {
        let personQuery = new PersonQuery(req.branchId),
            result = await(personQuery.getById(req.params.id, req.fiscalPeriodId));
        res.json(result);
    }))
    .put(async((req, res) => {
        try {
            req.container.get("CommandBus").send('personUpdate', [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async((req, res) => {
        try {
            req.container.get("CommandBus").send('detailAccountRemove', [req.params.id]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

router.route('/batch')
    .post(async((req, res) => {
        let cmd = req.body,
            ids;

        try {

            ids = req.container.get("CommandBus").send("peopleCreateBatch", [cmd]);

            res.json({isValid: true, returnValue: {ids}});

        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));
module.exports = router;