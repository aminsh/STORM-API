var models = require('../models');
var express = require('express');
var kendoQueryService = require('../services/kendoQueryService');
var router = express.Router();
var validate = require('../command.validators/command.validator.generalLedgerAccount');
var handle = require('../command.handlers/command.handler.generalLedgerAccount');
var view = require('../viewModel.assemblers/view.generalLedgerAccount');
var commandBus = require('../utilities/command.bus');

router.route('/general-ledger-accounts')
    .get(function (req, res) {

        var kendoRequest = kendoQueryService.getKendoRequestData(req.query);

        models.generalLedgerAccount
            .findAndCountAll(kendoRequest)
            .then(function (result) {
                var kendoResult = kendoQueryService.toKendoResultData(result);

                kendoResult.data = kendoResult.data.asEnumerable()
                    .select(view)
                    .toArray();

                res.json(kendoResult);
            });

    })
    .post(function (req, res) {
        var cmd = req.body;

        commandBus('command.generalLedgerAccount.create', JSON.stringify(cmd))
            .then(function (result) {
                res.json(result);
            });
        /* validate.onCreate(cmd)
         .then(function (result) {
         if (result.isValid)
         handle.create(cmd).then(function (returnValue) {
         res.json({
         isValid: true,
         returnValue: returnValue
         });
         })
         else
         res.json({
         isValid: false,
         errors: result.errors
         });
         });*/
    });

router.route('/general-ledger-accounts/:id')
    .get(function (req, res) {
        var id = req.params.id;

        models.generalLedgerAccount
            .findById(id)
            .then(function (gla) {
                res.json(view(gla));
            });
    })
    .put(function (req, res) {

        var id = req.params.id;
        var cmd = req.body;
        cmd.id = id;

        validate.onUpdate(cmd)
            .then(function (result) {
                if (result.isValid)
                    handle.update(cmd).then(function () {
                        res.json({
                            isValid: true,
                            cmd: cmd
                        });
                    })
                else
                    res.json({
                        isValid: false,
                        errors: errors,
                        cmd: cmd
                    });
            });
    })
    .delete(function (req, res) {
        var cmd = req.body;
        cmd.id = req.params.id;

        validate.onDelete(cmd).then(function (result) {
            if (result.isValid)
                handle.remote(cmd).then(function (returnValue) {
                    res.json({
                        isValid: true,
                        cmd: cmd,
                        returnValue: returnValue
                    });
                });
            else
                res.json({
                    isValid: false,
                    cmd: cmd,
                    errors: result.errors
                });
        });
    });


module.exports = router;