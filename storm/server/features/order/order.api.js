"use strict";

const express = require('express'),
    config = instanceOf('config'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    jwt = require('jsonwebtoken'),
    orderBl = require('./order.bl'),
    kendoQueryResolve = instanceOf('kendoQueryResolve'),
    EventEmitter = instanceOf('EventEmitter');


router.route('/')
    .get(async((req, res) => {
        try {
            let result = orderBl.getAll(req.query);
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
            res.status(201).json(orderBl.createSingle(req.body));
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
            let result = orderBl.getSingle(req.params);
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
            let returnValue = await(orderBl.deleteSingle(req.params.id));
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
    }))
    .patch(async((req, res) => {
        res.json(orderBl.editSingle(req.params.id, req.body));
    }));

module.exports = router;