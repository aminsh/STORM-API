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
        numberFieldName: 'temporaryDate',
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
        numberFieldName: 'temporaryDate',
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
        numberFieldName: 'temporaryDate',
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
        numberFieldName: 'temporaryDate',
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
        numberFieldName: 'temporaryDate',
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
        numberFieldName: 'temporaryDate',
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


module.exports.generalLedgerAccount = async(generalLedgerAccount);
module.exports.subsidiaryLedgerAccount = async(subsidiaryLedgerAccount);
module.exports.detailAccount = async(detailAccount);
module.exports.dimension1 = async(dimension1);
module.exports.dimension2 = async(dimension2);
module.exports.dimension3 = async(dimension3);
