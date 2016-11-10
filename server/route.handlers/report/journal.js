var knexService = require('../../services/knexService');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var ejs = require('ejs');
var fs = require("fs");
var pdf = require('html-pdf');
var translate = require('../../services/translateService');

function html(req, res) {
    var id = req.params.id;

    var data = await(query(id));

    res.render('report.journal.ejs', data);
}

function pdfRender(req, res) {
    var id = req.params.id;

    var data = await(query(id));

    var template = fs.readFileSync('../server/views/report.journal.ejs', 'utf8');

    var html = ejs.render(template, data);

    var options = {
        /*"height": "10.5in",        // allowed units: mm, cm, in, px
         "width": "8in",*/

        "format": "A4",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
        "orientation": "portrait",

        "header": {
            "height": "45mm",
            "contents": '<div style="text-align: center;">' +
            '<h1>{0}</h1>'.format(translate('Report organization title')) +
            '<h2>{0}</h2>'.format(translate('Report department title')) +
            '<h3>{0}</h3>'.format(translate('Report title')) +
            '</div>'
        },

        "footer": {
            "height": "28mm",
            "contents": {
                first: 'Cover page',
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        },


    };

    res.setHeader('Content-Type', 'application/pdf');

    pdf.create(html, options).toStream(function (err, stream) {
        stream.pipe(res);
    });


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

    journal.journalLines = journalLines;

    var dimension1Title = await(knexService.select().from('dimensionCategories').orderBy('id').limit(1))[0].title;

    return {
        journal: journal,
        dimension1Title: dimension1Title
    }
});

module.exports.html = async(html);
module.exports.pdf = async(pdfRender);