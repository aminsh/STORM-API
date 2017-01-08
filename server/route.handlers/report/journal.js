var knexService = require('../../services/knexService');
var persianDateService = require('../../services/persianDateService');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var fs = require("fs");
var path = require('path');
var Stimulsoft = require('stimulsoft-reports-js');
var number = require('../../utilities/number');
var config = require('../../config/config');
var jsdom = require("jsdom");
var pdf = require('html-pdf');
var pdfOptions = require('../../config/pdf.config');

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

    /*fonts.forEach(function (f) {
       Stimulsoft.Base.StiFontCollection.addOpentypeFontFile(__dirname + '/../../../client/fonts/'+ f.fileName);
    });

    Stimulsoft.Report.Dictionary.StiFunctions.addFunction(
        "devFunction",
        "digitToWord",
        "digitToWord", "", "",
        String, "", [Number], ["Amount"], [""],
        number.digitToWord);

    var report = new Stimulsoft.Report.StiReport();

    var today = new Stimulsoft.Report.Dictionary.StiVariable();
    today.name = 'today';
    today.alias = 'Today';
    today.category = "general";
    today.value = persianDateService.current();

    report.dictionary.variables.add(today);

    var user = new Stimulsoft.Report.Dictionary.StiVariable();
    user.name = 'user';
    user.alias = 'User';
    user.category = "general";
    user.value = req.user.name;

    report.dictionary.variables.add(user);

    report.regData("data", "data", {journal: data});
    report.loadFile(__dirname + '/../../../client/reportFiles/journal.mrt');
    report.render();

    var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
    var service = new Stimulsoft.Report.Export.StiHtmlExportService();
    var textWriter = new Stimulsoft.System.IO.TextWriter();
    var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
    service.exportTo(report, htmlTextWriter, settings);
    var resultHtml = textWriter.getStringBuilder().toString();
    resultHtml = resultHtml.replaceAll('DEMO', '');

    var staticRootPath = "file:///{0}".format(config.rootPath);
    var fontCssTag = '<link href="{0}/client/content/fonts.min.css" rel="stylesheet"/>'.format(staticRootPath);

    jsdom.env(
        resultHtml,
        ["http://code.jquery.com/jquery.js"],
        function (err, window) {
            var $ = window.$;
            window.$("head").append(fontCssTag);
            var html = $('html').html();
            html = '<html>{0}</html>'.format(html);

            pdf.create(html, pdfOptions).toStream(function (err, stream) {
                if (err) {
                    res.send('Occurs error on creating pdf ...');
                    return console.log(err);
                }

                stream.pipe(res);
            });
        }
    );*/


    //res.send(resultHtml);

    /*var settings = new Stimulsoft.Report.Export.StiPdfExportSettings();
    var service = new Stimulsoft.Report.Export.StiPdfExportService();
    var stream = new Stimulsoft.System.IO.MemoryStream();
    service.exportTo(report,stream, settings);

    var exported = stream.toArray();
    var buffer = new Buffer(exported, 'utf-8');
    fs.writeFileSync('./journal.pdf', buffer);

    res.setHeader('content-type', 'application/pdf');
    fs.createReadStream('./journal.pdf').pipe(res);*/

   /* res.render('report.journal.ejs', {
        reportData: data,
        fonts: fonts
    });*/
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