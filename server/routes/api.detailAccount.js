var models = require('../models');
var _ = require('lodash');
var express = require('express');
var kendoQueryService = require('../services/kendoQueryService');
var router = express.Router();
var view = require('../viewModel.assemblers/view.detailAccount');
var commandBus = require('../services/command.bus');

router.route('/detail-accounts')
    .get(function (req, res) {

        var kendoRequest = kendoQueryService.getKendoRequestData(req.query);

        models.detailAccount
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
            name: 'command.detailAccount.create',
            branchId: req.cookies.branchId,
            command: req.body
        }
        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    });

router.route('/detail-accounts/:id')
    .get(function (req, res) {
        var id = req.params.id;

        models.detailAccount
            .findById(id)
            .then(function (gla) {
                res.json(view(gla));
            });
    })
    .put(function (req, res) {

        var message = {
            name: 'command.detailAccount.update',
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
            name: 'command.detailAccount.remove',
            branchId: req.cookies.branchId,
            command: _.extend({id: req.params.id}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    });

router.route('/detail-accounts/:id/activate')
    .put(function (req, res) {
        var message = {
            name: 'command.detailAccount.remove',
            branchId: req.cookies.branchId,
            command: _.extend({id: req.params.id}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    });

router.route('/detail-accounts/:id/deactivate')
    .put(function (req, res) {
        var message = {
            name: 'command.detailAccount.remove',
            branchId: req.cookies.branchId,
            command: _.extend({id: req.params.id}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    });


module.exports = router;