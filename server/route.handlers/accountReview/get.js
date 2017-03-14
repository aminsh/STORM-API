var knexService = require('../../services/knexService');
var kendoQueryResolve = require('../../services/kendoQueryResolve');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var accountReviewQuery = require('./accountReviewQuery').accountReviewQuery;
var getDateRange = require('./accountReviewQuery').getDateRange;
var getaggregates = require('./accountReviewQuery').aggregates;

function generalLedgerAccount(req, res) {
    var filter = (req.query.extra) ? req.query.extra.filter : undefined;

    var dateRange = await(getDateRange(req.cookies['current-period'], filter));
    var options = {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        fromMainDate: dateRange.fromMainDate,
        filter: filter,
        dateFieldName: 'temporaryDate',
        numberFieldName: 'temporaryNumber',
        groupByField: 'generalLedgerAccountId'
    };

    var query = knexService.select().from(function () {
        this.select('generalLedgerAccountId', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
            knexService.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
            knexService.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'))
            .from(function () {
                accountReviewQuery.call(this, options);
            })
            .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
            .as('final');
    });

    if (eval(filter.notShowZeroRemainder))
        query.whereNot('sumRemainder', 0);

    var view = function (item) {
        return {
            generalLedgerAccountId: item.generalLedgerAccountId,
            generalLedgerAccountCode: item.generalLedgerAccountCode,
            generalLedgerAccountTitle: item.generalLedgerAccountTitle,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        };
    };

    var aggregatesQuery = query.clone();

    var result = await(kendoQueryResolve(query, req.query, view));

    result.aggregates = await(getaggregates(aggregatesQuery));

    res.json(result);
}

function subsidiaryLedgerAccount(req, res) {
    var filter = (req.query.extra) ? req.query.extra.filter : undefined;

    var dateRange = await(getDateRange(req.cookies['current-period'], filter));
    var options = {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        fromMainDate: dateRange.fromMainDate,
        filter: filter,
        dateFieldName: 'temporaryDate',
        numberFieldName: 'temporaryNumber',
        groupByField: 'subsidiaryLedgerAccountId'
    };

    var query = knexService.select().from(function () {
        this.select('subsidiaryLedgerAccountId', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
            knexService.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
            knexService.raw('"subsidiaryLedgerAccounts"."title" as "subsidiaryLedgerAccountTitle"'),
            knexService.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'))
            .from(function () {
                accountReviewQuery.call(this, options);
            })
            .leftJoin('subsidiaryLedgerAccounts', 'subsidiaryLedgerAccounts.id', 'groupJournals.subsidiaryLedgerAccountId')
            .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
            .as('final');
    });


    if (eval(filter.notShowZeroRemainder))
        query.whereNot('sumRemainder', 0);

    var view = function (item) {
        return {
            subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
            subsidiaryLedgerAccountCode: item.subsidiaryLedgerAccountCode,
            subsidiaryLedgerAccountTitle: item.subsidiaryLedgerAccountTitle,
            generalLedgerAccountCode: item.generalLedgerAccountCode,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        };
    };

    var aggregatesQuery = query.clone();

    var result = await(kendoQueryResolve(query, req.query, view));

    result.aggregates = await(getaggregates(aggregatesQuery));

    res.json(result);
}

function detailAccount(req, res) {
    var filter = (req.query.extra) ? req.query.extra.filter : undefined;

    var dateRange = await(getDateRange(req.cookies['current-period'], filter));
    var options = {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        fromMainDate: dateRange.fromMainDate,
        filter: filter,
        dateFieldName: 'temporaryDate',
        numberFieldName: 'temporaryNumber',
        groupByField: 'detailAccountId'
    };

    var query = knexService.select().from(function () {
        this.select('detailAccountId', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
            knexService.raw('"detailAccounts"."code" as "detailAccountCode"'),
            knexService.raw('"detailAccounts"."title" as "detailAccountTitle"')
            )
            .from(function () {
                accountReviewQuery.call(this, options);
            })
            .leftJoin('detailAccounts', 'detailAccounts.id', 'groupJournals.detailAccountId')
            .as('final');
    });


    if (eval(filter.notShowZeroRemainder))
        query.whereNot('sumRemainder', 0);

    var view = function (item) {
        return {
            detailAccountId: item.detailAccountId,
            detailAccountCode: item.detailAccountCode,
            detailAccountTitle: item.detailAccountTitle,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        };
    };

    var aggregatesQuery = query.clone();

    var result = await(kendoQueryResolve(query, req.query, view));

    result.aggregates = await(getaggregates(aggregatesQuery));

    res.json(result);
}

function dimension1(req, res) {
    var filter = (req.query.extra) ? req.query.extra.filter : undefined;

    var dateRange = await(getDateRange(req.cookies['current-period'], filter));
    var options = {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        fromMainDate: dateRange.fromMainDate,
        filter: filter,
        dateFieldName: 'temporaryDate',
        numberFieldName: 'temporaryNumber',
        groupByField: 'dimension1Id'
    };

    var query = knexService.select().from(function () {
        this.select('dimension1Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
            knexService.raw('"dimensions"."code" as "dimension1Code"'),
            knexService.raw('"dimensions"."title" as "dimension1Title"')
            )
            .from(function () {
                accountReviewQuery.call(this, options);
            })
            .leftJoin('dimensions', 'dimensions.id', 'groupJournals.dimension1Id')
            .as('final');
    });


    if (eval(filter.notShowZeroRemainder))
        query.whereNot('sumRemainder', 0);

    var view = function (item) {
        return {
            dimension1Id: item.dimension1Id,
            dimension1Code: item.dimension1Code,
            dimension1Title: item.dimension1Title,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        };
    };

    var aggregatesQuery = query.clone();

    var result = await(kendoQueryResolve(query, req.query, view));

    result.aggregates = await(getaggregates(aggregatesQuery));

    res.json(result);
}

function dimension2(req, res) {
    var filter = (req.query.extra) ? req.query.extra.filter : undefined;

    var dateRange = await(getDateRange(req.cookies['current-period'], filter));
    var options = {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        fromMainDate: dateRange.fromMainDate,
        filter: filter,
        dateFieldName: 'temporaryDate',
        numberFieldName: 'temporaryNumber',
        groupByField: 'dimension2Id'
    };

    var query = knexService.select().from(function () {
        this.select('dimension2Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
            knexService.raw('"dimensions"."code" as "dimension2Code"'),
            knexService.raw('"dimensions"."title" as "dimension2Title"')
            )
            .from(function () {
                accountReviewQuery.call(this, options);
            })
            .leftJoin('dimensions', 'dimensions.id', 'groupJournals.dimension2Id')
            .as('final');
    });


    if (eval(filter.notShowZeroRemainder))
        query.whereNot('sumRemainder', 0);

    var view = function (item) {
        return {
            dimension2Id: item.dimension2Id,
            dimension2Code: item.dimension2Code,
            dimension2Title: item.dimension2Title,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        };
    };

    var aggregatesQuery = query.clone();

    var result = await(kendoQueryResolve(query, req.query, view));

    result.aggregates = await(getaggregates(aggregatesQuery));

    res.json(result);
}

function dimension3(req, res) {
    var filter = (req.query.extra) ? req.query.extra.filter : undefined;

    var dateRange = await(getDateRange(req.cookies['current-period'], filter));
    var options = {
        fromDate: dateRange.fromDate,
        toDate: dateRange.toDate,
        fromMainDate: dateRange.fromMainDate,
        filter: filter,
        dateFieldName: 'temporaryDate',
        numberFieldName: 'temporaryNumber',
        groupByField: 'dimension3Id'
    };

    var query = knexService.select().from(function () {
        this.select('dimension3Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
            knexService.raw('"dimensions"."code" as "dimension3Code"'),
            knexService.raw('"dimensions"."title" as "dimension3Title"')
            )
            .from(function () {
                accountReviewQuery.call(this, options);
            })
            .leftJoin('dimensions', 'dimensions.id', 'groupJournals.dimension3Id')
            .as('final');
    });


    if (eval(filter.notShowZeroRemainder))
        query.whereNot('sumRemainder', 0);

    var view = function (item) {
        return {
            dimension3Id: item.dimension3Id,
            dimension3Code: item.dimension3Code,
            dimension3Title: item.dimension3Title,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        };
    };

    var aggregatesQuery = query.clone();

    var result = await(kendoQueryResolve(query, req.query, view));

    result.aggregates = await(getaggregates(aggregatesQuery));

    res.json(result);
}

function tiny(req, res) {
    var filter = (req.query.extra) ? req.query.extra.filter : undefined;
    var dateRange = await(getDateRange(req.cookies['current-period'], filter));
    var options = {
        fromDate: dateRange.fromMainDate,
        toDate: dateRange.toDate,
        fromMainDate: dateRange.fromMainDate,
        filter: filter,
        dateFieldName: 'temporaryDate',
        numberFieldName: 'temporaryNumber',
        groupByField: 'tiny'
    };

    var query = knexService.select().from(function () {
        this.select(
            'groupJournals.id',
            'date',
            'number',
            'article',
            'periodId',
            'journalStatus',
            'journalType',
            'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
            'groupJournals.generalLedgerAccountId',
            knexService.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
            knexService.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'),
            'subsidiaryLedgerAccountId',
            knexService.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
            knexService.raw('"subsidiaryLedgerAccounts"."title" as "subsidiaryLedgerAccountTitle"'),
            knexService.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
            'detailAccountId',
            knexService.raw('"detailAccounts"."code" as "detailAccountCode"'),
            knexService.raw('"detailAccounts"."title" as "detailAccountTitle"'),
            'dimension1Id',
            knexService.raw('"dimension1s"."code" as "dimension1Code"'),
            knexService.raw('"dimension1s"."title" as "dimension1Title"'),
            'dimension2Id',
            knexService.raw('"dimension2s"."code" as "dimension2Code"'),
            knexService.raw('"dimension2s"."title" as "dimension2Title"'),
            'dimension3Id',
            knexService.raw('"dimension3s"."code" as "dimension3Code"'),
            knexService.raw('"dimension3s"."title" as "dimension3Title"')
            )
            .from(function () {
                accountReviewQuery.call(this, options);
            })
            .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
            .leftJoin('subsidiaryLedgerAccounts', 'subsidiaryLedgerAccounts.id', 'groupJournals.subsidiaryLedgerAccountId')
            .leftJoin('detailAccounts', 'detailAccounts.id', 'groupJournals.detailAccountId')
            .leftJoin(knexService.raw('"dimensions" as "dimension1s"'), 'dimension1s.id', 'groupJournals.dimension1Id')
            .leftJoin(knexService.raw('"dimensions" as "dimension2s"'), 'dimension2s.id', 'groupJournals.dimension2Id')
            .leftJoin(knexService.raw('"dimensions" as "dimension3s"'), 'dimension3s.id', 'groupJournals.dimension3Id')
            .orderBy('number')
            .as('final')
    });

    var view = function (item) {
        return {
            id: item.id,
            number: item.number,
            date: item.date,
            article: item.article,
            subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
            subsidiaryLedgerAccountCode: item.subsidiaryLedgerAccountCode,
            subsidiaryLedgerAccountTitle: item.subsidiaryLedgerAccountTitle,
            generalLedgerAccountCode: item.generalLedgerAccountCode,
            detailAccountCode: item.detailAccountCode,
            detailAccountTitle: item.detailAccountTitle,
            dimension1Code: item.dimension1Code,
            dimension1Title: item.dimension1Title,
            dimension2Code: item.dimension2Code,
            dimension2Title: item.dimension2Title,
            dimension3Code: item.dimension3Code,
            dimension3Title: item.dimension3Title,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        };
    };

    var aggregatesQuery = query.clone();

    var result = await(kendoQueryResolve(query, req.query, view));

    result.aggregates = await(getaggregates(aggregatesQuery));

    res.json(result);
}

module.exports.generalLedgerAccount = async(generalLedgerAccount);
module.exports.subsidiaryLedgerAccount = async(subsidiaryLedgerAccount);
module.exports.detailAccount = async(detailAccount);
module.exports.dimension1 = async(dimension1);
module.exports.dimension2 = async(dimension2);
module.exports.dimension3 = async(dimension3);
module.exports.tiny = async(tiny);
