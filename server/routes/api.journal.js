var db = require('../models');
var express = require('express');
var kendoQueryService = require('../services/kendoQueryService');
var router = express.Router();
var view = require('../viewModel.assemblers/view.journal');


router.route('/journal')
    .get(function (req, res) {
        var options = kendoQueryService.getKendoRequestData(req.query);
        options.distinct = true;
        options.include = [
            {
                model: db.journalLine,
            },
            {
                model: db.user
            }
        ];

        db.journal.findAndCountAll(options)
            .then(function (result) {
                var kendoResult = kendoQueryService.toKendoResultData(result);
                kendoResult.data = kendoResult.data.asEnumerable()
                    .select(view)
                    .toArray();

                res.json(kendoResult);
            });
    })
    .post(function (req, res) {

    });

router.route('/journal/:id')
    .get(function (req, res) {

    })
    .put(function (req, res) {

    })
    .delete(function (req, res) {

    });

module.exports = router;