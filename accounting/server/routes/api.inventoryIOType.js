"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    router = require('express').Router(),
    InventoryIOTypeQuery = require('../queries/query.inventoryIOType');

router.route('/:type')
    .get(async((req, res) => {
        let inventoryIOTypeQuery = new InventoryIOTypeQuery(req.branchId),
            result = await(inventoryIOTypeQuery.getAll(req.params.type, req.query));
        res.json(result);
    }))
    .post(async((req, res) => {

        try {

            let cmd = req.body;
            cmd.type = req.params.type;

            const id = req.container.get("CommandBus").send("inventoryIOTypeCreate", [cmd]);
            res.json({isValid: true, returnValue: {id}});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }

    }));

router.route('/:id')
    .put(async(function (req, res) {

        try {

            req.container.get("CommandBus").send("inventoryIOTypeUpdate", [req.params.id, req.body]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }))
    .delete(async(function (req, res) {

        try {

            req.container.get("CommandBus").send("inventoryIOTypeRemove", [req.params.id]);
            res.json({isValid: true});
        }
        catch (e) {
            res.json({isValid: false, errors: e.errors});
        }
    }));

module.exports = router;