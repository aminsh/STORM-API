var db = require('../models');
var express = require('express');
var _ = require('lodash');
var kendoQueryService = require('../services/kendoQueryService');
var router = express.Router();
var view = require('../viewModel.assemblers/view.journalLine');
var commandBus = require('../services/command.bus');

router.route('/journalLines/journal/:journalId')
    .get(function (req, res) {
        var options = kendoQueryService.getKendoRequestData(req.query);
        options.distinct = true;
        options.include = [
            {model: db.generalLedgerAccount},
            {model: db.subsidiaryLedgerAccount},
            {model: db.detailAccount},
            {model: db.dimension, as: 'dimension1'},
            {model: db.dimension, as: 'dimension2'},
            {model: db.dimension, as: 'dimension3'}
        ];


        db.journalLine.findAndCountAll(options)
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
            name: 'command.journal.create',
            branchId: req.cookies,
            command: _.extend({journalId: req.params.journalId}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    });

router.route('/journalLines/:id')
    .get(function (req, res) {
        var option = {
            include: [
                {model: db.generalLedgerAccount},
                {model: db.subsidiaryLedgerAccount},
                {model: db.detailAccount},
                {model: db.dimension, as: 'dimension1'},
                {model: db.dimension, as: 'dimension2'},
                {model: db.dimension, as: 'dimension3'}
            ]
        };

        db.findOne(option).then(function (result) {
            res.json(view(result));
        });
    })
    .put(function (req, res) {
        var message = {
            name: 'command.journal.update',
            branchId: req.cookies.branchId,
            command: _.extend({journalId: req.params.journalId}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    })
    .delete(function (req, res) {
        var message = {
            name: 'command.journal.remove',
            branchId: req.cookies.branchId,
            command: _.extend({journalId: req.params.journalId}, req.body)
        };

        commandBus.send(message)
            .then(function (result) {
                res.json(result);
            });
    });

module.exports = router;