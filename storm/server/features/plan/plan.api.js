"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    planBl = require('./plan.bl');

router.route('/')
    .get(async((req, res) => {
        try {
            let result = planBl.getAll(req.query);
            if (!result) {
                res.status(200).json({data:[], total: "0"});
            } else {
                res.json(result);
            }
        } catch (e) {
            res.status(500).send();
        }
    }))
    .post(async((req, res) => {
        try {
            res.status(201).json(planBl.createSingle(req.body));
        } catch (e) {
            if(e instanceof ValidationException) {
                res.status(400).send(e);
            } else {
                res.status(500).send();
                console.log(e);
            }
        }
    }));

router.route("/:id")
    .get(async((req, res) => {
        try {
            let result = planBl.getSingle(req.params.id);
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
            let returnValue = await(planBl.deleteSingle(req.params.id));
            if(returnValue===0) {
                res.status(404).send();
            } else {
                res.json({rowEffected: returnValue});
            }
        } catch (e) {
            if(e instanceof ValidationException) {
                res.status(400).json(e);
            } else {
                res.status(500).send();
            }
        }
    }));
    /*.patch(async((req, res) => {
        res.json(planBl.editSingle(req.params.id, req.body));
    }));*/

module.exports = router;