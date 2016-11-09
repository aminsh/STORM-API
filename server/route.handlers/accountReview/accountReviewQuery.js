var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var async = require('asyncawait/async');
var await = require('asyncawait/await');


function accountReviewQuery(options) {
    var fromDate = options.fromDate;
    var toDate = options.toDate;
    var fromMainDate = options.fromMainDate;
    var filter = options.filter;
    var dateFieldName = options.dateFieldName;
    var numberFieldName = options.numberFieldName;
    var tinyGroupByFields = [
        'id',
        'date',
        'number',
        'description',
        'periodId',
        'journalStatus',
        'journalType',
        'generalLedgerAccountId',
        'subsidiaryLedgerAccountId',
        'detailAccountId',
        'dimension1Id',
        'dimension2Id',
        'dimension3Id',
        'article'];

    var groupByField = options.groupByField == 'tiny'
        ? tinyGroupByFields
        : options.groupByField;

    this.select([
        knexService.raw('SUM("beforeRemainder") as "sumBeforeRemainder"'),
        knexService.raw('SUM("debtor") as "sumDebtor"'),
        knexService.raw('SUM("creditor") as "sumCreditor"'),
        knexService.raw('SUM("beforeRemainder") + SUM("debtor") - SUM("creditor") as "sumRemainder"')
    ].concat(groupByField)).from(filterJournals)
        .groupBy(groupByField)
        .orderBy(groupByField)
        .as('groupJournals');

    function baseJournals() {

        this.select(
            'journals.id',
            knexService.raw('"journals"."{0}" as "number"'.format(numberFieldName)),
            knexService.raw('"journals"."{0}" as "date"'.format(dateFieldName)),
            'journals.description',
            'journals.periodId',
            'journals.journalStatus',
            'journals.journalType',
            'journalLines.generalLedgerAccountId',
            'journalLines.subsidiaryLedgerAccountId',
            'journalLines.detailAccountId',
            'journalLines.dimension1Id',
            'journalLines.dimension2Id',
            'journalLines.dimension3Id',
            'journalLines.article',
            'journalLines.debtor',
            'journalLines.creditor'
        ).from('journals')
            .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
            .as('baseJournals');
    }

    function filterJournals() {

        var amountFields = _getAmountFields();

        this.select(
            'id',
            'date',
            'number',
            'description',
            'periodId',
            'journalStatus',
            'journalType',
            'generalLedgerAccountId',
            'subsidiaryLedgerAccountId',
            'detailAccountId',
            'dimension1Id',
            'dimension2Id',
            'dimension3Id',
            'article',
            amountFields.beforeRemainder,
            amountFields.debtor,
            amountFields.creditor
        ).from(baseJournals)
            .whereBetween('date', [fromDate, toDate])
            .as('dateControlJournals');

        _executeFilter(this, filter);
    }

    function _getAmountFields() {
        if (options.groupByField == 'tiny')
            return {
                beforeRemainder: knexService.raw('0 as "beforeRemainder"'),
                creditor: 'creditor',
                debtor: 'debtor',
            };

        var beforeRemainder = 'CASE WHEN "date" < \'{0}\' '.format(fromMainDate) +
            'THEN "debtor" -  "creditor" ' +
            'ELSE 0 END as "beforeRemainder"';

        var debtor = 'CASE WHEN "date" >= \'{0}\' THEN "debtor" ELSE 0 END as "debtor"'
            .format(fromMainDate);
        var creditor = 'CASE WHEN "date" >= \'{0}\' THEN "creditor" ELSE 0 END as "creditor"'
            .format(fromMainDate);

        return {
            beforeRemainder: knexService.raw(beforeRemainder),
            creditor: knexService.raw(creditor),
            debtor: knexService.raw(debtor),
        };
    }

    function _executeFilter(query) {
        if (filter.minNumber && filter.maxNumber)
            query.andWhereBetween('number', [filter.minNumber, filter.maxNumber]);

        if (filter.generalLedgerAccountId)
            query.andWhere('generalLedgerAccountId', filter.generalLedgerAccountId);

        if (filter.subsidiaryLedgerAccountId)
            query.andWhere('subsidiaryLedgerAccountId', filter.subsidiaryLedgerAccountId);

        if (filter.detailAccountId)
            query.andWhere('detailAccountId', filter.detailAccountId);

        if (filter.dimension1Id)
            query.andWhere('dimension1Id', filter.dimension1Id);

        if (filter.dimension2Id)
            query.andWhere('dimension2Id', filter.dimension2Id);

        if (filter.dimension3Id)
            query.andWhere('dimension3Id', filter.dimension3Id);
    }
}

module.exports.accountReviewQuery = accountReviewQuery;
module.exports.getDateRange = async(function (fiscalPeriodId, filter) {
    var currentPeriod = await(knexService
        .select()
        .from('fiscalPeriods')
        .where('id', fiscalPeriodId))[0];

    if (!eval(filter.isNotPeriodIncluded))
        return {
            fromDate: currentPeriod.minDate,
            fromMainDate: (filter.minDate && filter.minDate >= currentPeriod.minDate) ? filter.minDate : currentPeriod.minDate,
            toDate: (filter.maxDate && filter.maxDate <= currentPeriod.maxDate) ? filter.maxDate : currentPeriod.maxDate
        };

    if (!(filter.minDate && filter.maxDate))
        return {
            fromDate: "0",
            fromMainDate: "0",
            toDate: "9999/99/99"

        };

    return {
        fromDate: "0",
        fromMainDate: filter.minDate,
        toDate: filter.maxDate
    };
});
module.exports.aggregates = async(function (query) {
    var aggregates = await(query
        .select(
            knexService.raw('SUM("sumBeforeRemainder") as "totalBeforeRemainder"'),
            knexService.raw('SUM("sumDebtor") as "totalDebtor"'),
            knexService.raw('SUM("sumCreditor") as "totalCreditor"'),
            knexService.raw('SUM("sumRemainder") as "totalRemainder"')
        ))[0];

    return {
        sumBeforeRemainder: {sum: aggregates.totalBeforeRemainder},
        sumDebtor: {sum: aggregates.totalDebtor},
        sumCreditor: {sum: aggregates.totalCreditor},
        sumRemainder: {sum: aggregates.totalRemainder}
    };
});

