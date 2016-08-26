var guidService = require('../utility/guidService');
var Enumerable = require('linq');
var journals = require('./../data/data').journals;
var express = require('express');
var router = express.Router();

router.route('/journals')
    .get(function (req, res) {
        res.json({data: journals});
    })
    .post(function (req, res) {
        var cmd = req.body;

        console.log(cmd);

        cmd.id = guidService.newGuid();
        journals.push(cmd);

        console.log(cmd);

        res.json({
            isValid: true,
            returnValue: {id: cmd.id}
        });
    });

router.route('/journals/:id')
    .get(function (req, res) {
        var id = req.params.id;

        var journal = Enumerable.from(journals)
            .first(function (item) {
                return item.id == id;
            });

        res.json(journal);
    })
    .put(function (req, res) {
        var id = req.params.id;
        var cmd = req.body;
        console.log(cmd);

        var journal = Enumerable.from(journals)
            .first(function (item) {
                return item.id = id;
            });

        journal.temporaryNumber = cmd.temporaryNumber;
        journal.temporaryDate = cmd.temporaryDate;
        journal.number = cmd.number;
        journal.date = cmd.date;
        journal.description = cmd.description;

        res.json({
            isValid: true
        });
    });

router.route('/journals/:id/bookkeeping')
    .put(function (req, res) {
        console.log('id :');
        console.log(req.params.id);
        console.log('cmd :');
        console.log(req.body);

        res.json({
            isValid: true
        });
    });

router.route('/journals/:id/attach-image')
    .put(function (req, res) {
        console.log(req.body);

        res.json({
            isValid: true
        });
    });


module.exports = router;
