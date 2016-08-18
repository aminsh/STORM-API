var models = require('../models');
var express = require('express');
var _ = require('lodash');
var kendoQueryService = require('../services/kendoQueryService');
var router = express.Router();
var view = require('../viewModel.assemblers/view.generalLedgerAccount');
var commandBus = require('../services/command.bus.js');

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
        var message = {
            name: 'command.generalLedgerAccount.create',
            branchId: req.cookies.branchId,
            command: req.body
        };
        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
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

        var message = {
            name: 'command.generalLedgerAccount.update',
            branchId: req.cookies.branchId,
            command: _.extend({id: req.params.id}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    })
    .delete(function (req, res) {
        var message = {
            name: 'command.generalLedgerAccount.remove',
            branchId: req.cookies.branchId,
            command: _.extend({id: req.params.id}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    });


module.exports = router;