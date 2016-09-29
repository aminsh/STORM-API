var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var view = require('../../viewModel.assemblers/view.journal');
var enums = require('../../constants/enums');

function getAll(req, res) {
    var currentFiscalPeriod = req.cookies['current-period'];
    var query = knexService.select().from(function () {
        var selectExp = 'journals.*, SUM(debtor) as "sumDebtor", SUM(creditor) as "sumCreditor"'
        this.select(knexService.raw(selectExp)).from('journals')
            .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
            .where('periodId', currentFiscalPeriod)
            .groupBy('journals.id')
            .as('baseJournals');
    }).as('baseJournals');

    kendoQueryResolve(query, req.query, view)
        .then(function (result) {
            res.json(result);
        });
}

function getGroupedByMouth(req, res) {
    var currentFiscalPeriod = req.cookies['current-period'];

    var selectExp = '"month",' +
        '"count"(*) as "count",' +
        '"min"("temporaryNumber") as "minNumber",' +
        '"max"("temporaryNumber") as "maxNumber",' +
        '"min"("temporaryDate") as "minDate",' +
        '"max"("temporaryDate") as "maxDate"';

    knexService.select(knexService.raw(selectExp)).from(function () {
            this.select(knexService.raw('*,cast(substring("temporaryDate" from 6 for 2) as INTEGER) as "month"'))
                .from('journals')
                .where('periodId', currentFiscalPeriod)
                .as('baseJournals');
        })
        .as('baseJournals')
        .groupBy('month')
        .orderBy('month')
        .then(function (result) {
            result = result.asEnumerable().select(function (r) {
                r.monthName = enums.getMonth().getDisplay(r.month);
                return r;
            }).toArray();

            res.json({data: result})
        });
}

function getJournalsByMonth(req, res) {
    var currentFiscalPeriod = req.cookies['current-period'];
    var selectExp = '"id","temporaryNumber","temporaryDate","number","date","description",' +
        'CASE WHEN "journalStatus"=\'Fixed\' THEN TRUE ELSE FALSE END as "isFixed",' +
        'CASE WHEN "attachmentFileName" IS NOT NULL THEN TRUE ELSE FALSE END as "hasAttachment",' +
        '(select "sum"("debtor") from "journalLines" WHERE "journalId" = journals."id") as "sumAmount",' +
        '(select "count"(*) from "journalLines" WHERE "journalId" = journals."id") as "countOfRows"';

    var query = knexService.select().from(function () {
        this.select(knexService.raw(selectExp)).from('journals')
            .where(knexService.raw('cast(substring("temporaryDate" from 6 for 2) as INTEGER)'), req.params.month)
            .andWhere('periodId', currentFiscalPeriod)
            .orderBy('temporaryNumber')
            .as('baseJournals');
    });

    kendoQueryResolve(query, req.query, function (e) {
        return e;
    })
        .then(function (result) {
            res.json(result);
        });
}

module.exports.getAll = getAll;
module.exports.getGroupedByMouth = getGroupedByMouth;
module.exports.getJournalsByMonth = getJournalsByMonth;