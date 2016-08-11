var models = require('../models');
var express = require('express');
var kendoQueryService = require('../services/kendoQueryService');
var router = express.Router();
var validate = require('../command.validators/command.validator.subsidiaryLedgerAccount');
var handle = require('../command.handlers/command.handler.subsidiaryLedgerAccount');
var view = require('../viewModel.assemblers/view.subsidiaryLedgerAccount');
var commandBus = require('../services/command.bus.js');

router.route('/subsidiary-ledger-accounts/general-ledger-account/:parentId')
    .get(function (req, res) {
        var parentId = req.params.parentId;

        var kendoRequest = kendoQueryService.getKendoRequestData(req.query);
        kendoRequest.distinct = true;
        kendoRequest.include = [
            {model: models.generalLedgerAccount, where: {id: parentId}},
            {
                model: models.subsidiaryLedgerAccountDimensionAssignmentStatus,
                include: {model: models.dimensionCategory},
                required: false
            }
        ];

        models.subsidiaryLedgerAccount
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
        cmd.generalLedgerAccountId = req.params.parentId;


        /*validate.onCreate(cmd)
         .then(function (result) {
         if (result.isValid)
         handle.create(cmd).then(function (returnValue) {
         res.json({
         isValid: true,
         returnValue: returnValue
         });
         });
         else
         res.json({
         isValid: false,
         errors: result.errors
         });
         });*/
    });

router.route('/subsidiary-ledger-accounts/:id')
    .get(function (req, res) {
        var id = req.params.id;

        models.subsidiaryLedgerAccount.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: models.subsidiaryLedgerAccountDimensionAssignmentStatus,
                    include: {model: models.dimensionCategory}
                }
            ]
        }).then(function (result) {
            res.json(view(result));
        });

    })
    .put(function (req, res) {
        var id = req.params.id;
        var cmd = req.body;
        cmd.id = id;

        validate.onUpdate(cmd)
            .then(function (result) {
                if (result.isValid)
                    handle.update(cmd).then(function (returnValue) {
                        res.json({
                            isValid: true,
                            returnValue: returnValue
                        });
                    });
                else
                    res.json({
                        isValid: false,
                        errors: result.errors
                    });
            });
    })
    .delete(function (req, res) {
        var id = req.params.id;
        var cmd = req.body;
        cmd.id = id;

        validate.onDelete(cmd)
            .then(function (result) {
                if (result.isValid)
                    handle.remove(cmd).then(function (returnValue) {
                        res.json({
                            isValid: true,
                            returnValue: returnValue
                        });
                    });
                else
                    res.json({
                        isValid: false,
                        errors: result.errors
                    });
            });
    });

router.route('/subsidiary-ledger-accounts/:id/activate')
    .put(function (req, res) {
        var id = req.params.id;
        var cmd = req.body;
        cmd.id = id;

        handle.activate(cmd).then(function (returnValue) {
            res.json({
                isValid: true,
                returnValue: returnValue
            });
        });
    });

router.route('/subsidiary-ledger-accounts/:id/deactivate')
    .put(function (req, res) {
        var id = req.params.id;
        var cmd = req.body;
        cmd.id = id;

        handle.deactivate(cmd).then(function (returnValue) {
            res.json({
                isValid: true,
                returnValue: returnValue
            });
        });
    });

module.exports = router;
