var guidService = require('../utility/guidService');
var Enumerable = require('linq');
var detailAccounts = require('./../data/data').detailAccounts;
var express = require('express');
var router = express.Router();


router.route('/detail-accounts')
    .get(function (req, res) {
        res.json({data: detailAccounts});
    })
    .post(function (req, res) {
        var cmd = req.body;

        console.log(cmd);

        detailAccounts.push(cmd);

        console.log(cmd);

        res.json({
            validationResult: {isValid: true},
            returnValue: {id: guidService.newGuid()}
        });
    });

router.route('/detail-accounts/:id')
    .get(function (req, res) {
        var da = Enumerable.from(detailAccounts)
            .first(function (item) {
                return item.id == req.params.id
            });

        res.json(da);
    })
    .put(function (req, res) {
        var cmd = req.body;
        console.log(cmd);

        var gla = Enumerable.from(detailAccounts)
            .first(function (item) {
                return item.id = req.params.id;
            });

        gla.code = cmd.code;
        gla.title = cmd.title;
        gla.description = cmd.description;

        res.json({
            validationResult: {isValid: true}
        });
    });

router.route('/detail-accounts/:id/activate')
    .put(function (req, res) {
        var da = Enumerable.from(detailAccounts)
            .first(function (item) {
                return item.id == req.params.id
            });

        da.isActive = true;

        res.json({
            validationResult: {isValid: true}
        });
    });

router.route('/detail-accounts/:id/deactivate')
    .put(function (req, res) {
        var da = Enumerable.from(detailAccounts)
            .first(function (item) {
                return item.id == req.params.id
            });

        da.isActive = false;

        res.json({
            validationResult: {isValid: true}
        });
    });

module.exports = router;