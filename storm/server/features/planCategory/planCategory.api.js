"use strict";

const express = require('express'),
    config = instanceOf('config'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    jwt = require('jsonwebtoken'),
    planCategoryRepositoryBl = require('./planCategory.bl'),
    kendoQueryResolve = instanceOf('kendoQueryResolve'),
    EventEmitter = instanceOf('EventEmitter');

router.route('/')
    .get(async((req, res) => {
        try {
            let returnValue;
            if (req.query.detail !== undefined && req.query.detail==='true') {
                //result contain plans
                returnValue = planCategoryRepositoryBl.getWithDetail(req.query);
            } else {
                //just return planCategories
                returnValue = planCategoryRepositoryBl.getAll(req.query);
            }

            if (!returnValue) {
                res.status(200).json({planCategories: [], total: "0"});
            } else {
                res.json(returnValue);
            }
        } catch (e) {
            res.status(500).send();
            console.log(e);
        }

    }))
    .post(async((req, res) => {
        try {
            res.status(201).json(planCategoryRepositoryBl.createSingle(req.body));
        } catch (e) {
            if (e instanceof ValidationException) {
                res.status(400).json(e.errors);
            } else {
                res.status(500).send();
                console.log(e);
            }
        }
    }));

router.route("/:id")
    .get(async((req, res) => {
        try {
            let result = planCategoryRepositoryBl.getSingle(req.params);
            if (!result) {
                res.status(404).send();
            } else {
                res.json(result);
            }
        } catch (e) {
            res.status(500).send();
        }

    }))
    .delete(async((req, res) => {
        try {
            let returnValue = await(planCategoryRepositoryBl.deleteSingle(req.params.id));
            if (returnValue === 0) {
                res.status(404).send();
            } else {
                res.json({rowEffected: returnValue});
            }
        } catch (e) {
            if (e instanceof ValidationException) {
                res.status(400).json(e);
            } else {
                res.status(500).send();
            }
        }
    }))
module.exports = router;