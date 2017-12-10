"use strict";

const express = require('express'),
    router = express.Router(),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    giftBl = require('./gift.bl');

router.route('/')
    .get(async((req, res) => {
        try {
            let returnValue = giftBl.getAll(req.query);
            if (!returnValue) {
                res.status(200).json({data:[], total: "0"});
            } else {
                res.json(returnValue);
            }
        } catch(e) {
            res.status(500).send();
            console.log(e);
        }    }))
    .post(async((req, res) => {
        try {
            res.status(201).json(giftBl.createSingle(req.body));
        } catch (e){
            if(e instanceof ValidationException) {
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
            let result = giftBl.getSingle(req.params);
            if(!result) {
                res.status(404).send();
            } else {
                res.json(result);
            }
        } catch (e){
            res.status(500).send();
        }    }))
    .delete(async((req, res) => {
        try {
            let returnValue = await(giftBl.deleteSingle(req.params.id));
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

module.exports = router;