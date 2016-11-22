var knexService = require('../../services/knexService');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var fs = require("fs");
var path = require('path');

var fonts = fs.readdirSync(__dirname + '/../../../client/fonts')
    .filter(function (fileName) {
        return path.extname(fileName) == '.ttf';
    }).asEnumerable().select(function (fileName) {
        return {
            fileName: fileName,
            name: path.basename(fileName, '.ttf')
        }
    }).toArray();

function journal(req, res) {
    var id = req.params.id;

    var data = await(query(id));

    res.render('report.journal.ejs', {
        reportData: data,
        fonts: fonts
    });
}

function json(req, res) {
    var id = req.params.id;

    var data = await(query(id));

    res.json(data);
}

var query = async(function (id) {
    var journal = await(knexService.select(
        'journals.id',
        'journals.number',
        'journals.date',
        'journals.temporaryNumber',
        'journals.temporaryDate',
        'journals.description',
        knexService.raw('sum("journalLines"."debtor") as "sumDebtor"'),
        knexService.raw('sum("journalLines"."creditor") as "sumCreditor"')
        )
        .from('journals')
        .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
        .groupBy(
            'journals.id',
            'journals.number',
            'journals.date',
            'journals.temporaryNumber',
            'journals.temporaryDate',
            'journals.description')
        .where('journals.id', id))[0];

    var journalLines = await(knexService.select(
        'journalLines.row',
        'journalLines.article',
        'journalLines.debtor',
        'journalLines.creditor',
        knexService.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
        knexService.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
        knexService.raw('"detailAccounts"."code" as "detailAccountCode"'),
        knexService.raw('"detailAccounts"."title" as "detailAccountTitle"'),
        knexService.raw('"dimension1s"."code" as "dimension1Code"'),
        knexService.raw('"cheques"."number" as "chequeNumber"')
        )
        .from('journalLines')
        .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'journalLines.generalLedgerAccountId')
        .leftJoin('subsidiaryLedgerAccounts', 'subsidiaryLedgerAccounts.id', 'journalLines.subsidiaryLedgerAccountId')
        .leftJoin('detailAccounts', 'detailAccounts.id', 'journalLines.detailAccountId')
        .leftJoin(knexService.raw('"dimensions" as "dimension1s"'), 'dimension1s.id', 'journalLines.dimension1Id')
        .leftJoin(knexService.raw('"dimensions" as "dimension2s"'), 'dimension2s.id', 'journalLines.dimension2Id')
        .leftJoin(knexService.raw('"dimensions" as "dimension3s"'), 'dimension3s.id', 'journalLines.dimension3Id')
        .leftJoin(knexService.raw('cheques'), 'cheques.journalLineId', 'journalLines.id')
        .orderBy('journalLines.row')
        .where('journalId', id));

    var dimensionCategories = await(knexService.select().from('dimensionCategories').orderBy('id'));

    return {
        journal: journal,
        journalLines: journalLines,
        dimension1Title: dimensionCategories[0].title,
        dimension2Title: dimensionCategories[1].title,
        dimension3Title: dimensionCategories[2].title
    }
});

module.exports.journal = async(journal);
module.exports.json = async(json);