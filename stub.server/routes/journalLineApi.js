var guidService = require('../utility/guidService');
var Enumerable = require('linq');
var accountingData = require('./../data/data');
var journalLines = accountingData.journalLines;
var express = require('express');
var router = express.Router();

router.route('/journal-lines/journal/:journalId')
    .get(function (req, res) {
        var journalId = req.params.journalId;

        var jls = Enumerable.from(journalLines)
            .where(function (line) {
                return line.journalId == journalId;
            })
            .toArray();

        res.json({
            data: jls,
            aggregates: {
                debtor: {sum: 355000},
                creditor: {sum: 355000}
            }, total: 12
        });
    })
    .post(function (req, res) {
        var jouranlId = req.params.journalId;
        var cmd = req.body;

        console.log(cmd);

        cmd.id = guidService.newGuid();
        cmd.journalId = jouranlId;

        journalLines.push(cmd);

        console.log(cmd);

        res.json({
            isValid: true,
            returnValue: {id: cmd.id}
        });
    });

router.route('/journal-lines/:id')
    .get(function (req, res) {
        var id = req.params.id;

        var journal = Enumerable.from(journalLines)
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

        journal.generalLedgerAccountId = cmd.generalLedgerAccountId;
        journal.subsidiaryLedgerAccountId = cmd.subsidiaryLedgerAccountId;
        journal.detailAccountId = cmd.detailAccountId;

        journal.generalLedgerAccountDisplay = accountingData
            .generalLedgerAccounts
            .first(function (g) {
                return g.id = cmd.cmd.generalLedgerAccountId;
            }).title;

        journal.subsidiaryLedgerAccountDisplay = accountingData
            .subsidiaryLedgerAccounts
            .first(function (g) {
                return g.id = cmd.subsidiaryLedgerAccountId;
            }).title;

        journal.detailAccountId = accountingData
            .detailAccounts
            .first(function (g) {
                return g.id = cmd.detailAccountId;
            }).title;

        journal.dimensions = [];

        //if(cmd.dimensions != undefined && cmd.dimensions.length > 0){
        //    cmd.dimensions.forEach(function (d) {
        //
        //    })
        //}
        journal.temporaryDate = cmd.temporaryDate;
        journal.number = cmd.number;
        journal.date = cmd.date;
        journal.description = cmd.description;

        res.json({
            isValid: true
        });
    });

module.exports = router;
