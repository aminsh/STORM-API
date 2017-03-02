"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    groupBy = require('./query.accountReview.groupby'),
    enums = require('../constants/enums');

module.exports = class AccountReview extends BaseQuery {
    constructor(branchId, fiscalPeriodId, filter, paramters) {
        super(branchId);

        this.getDateRange = async(this.getDateRange);
        this.aggregates = async(this.aggregates);
        this.incomesAndOutcomes = async(this.incomesAndOutcomes);

        this.filter = filter;
        this.paramters = paramters;
        this.fiscalPeriodId = fiscalPeriodId;
    }

    getDateRange(fiscalPeriodId) {
        let currentPeriod = await(this.knex.select()
            .from('fiscalPeriods')
            .where('id', fiscalPeriodId).first()),
            filter = this.filter;

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
    }

    aggregates(query) {
        let knex = this.knex;
        let aggregates = await(query
            .select(
                knex.raw('SUM("sumBeforeRemainder") as "totalBeforeRemainder"'),
                knex.raw('SUM("sumDebtor") as "totalDebtor"'),
                knex.raw('SUM("sumCreditor") as "totalCreditor"'),
                knex.raw('SUM("sumRemainder") as "totalRemainder"')
            ).first());

        return {
            sumBeforeRemainder: {sum: aggregates.totalBeforeRemainder},
            sumDebtor: {sum: aggregates.totalDebtor},
            sumCreditor: {sum: aggregates.totalCreditor},
            sumRemainder: {sum: aggregates.totalRemainder}
        };
    }

    getOptions() {
        let dateRange = await(this.getDateRange(this.fiscalPeriodId));
        return {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
            fromMainDate: dateRange.fromMainDate,
            filter: this.filter,
            dateFieldName: 'temporaryDate',
            numberFieldName: 'temporaryNumber'
        };
    }

    generalLedgerAccount() {
        let options = this.getOptions(),
            knex = this.knex;

        let query = knex.select().from(function () {
            this.select('generalLedgerAccountId', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
                knex.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'))
                .from(function () {
                    groupBy.call(this, knex, options, 'generalLedgerAccountId')
                })
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
                .as('final');
        });

        if (eval(this.filter.notShowZeroRemainder))
            query.whereNot('sumRemainder', 0);

        let view = (item) => ({
            generalLedgerAccountId: item.generalLedgerAccountId,
            generalLedgerAccountCode: item.generalLedgerAccountCode,
            generalLedgerAccountTitle: item.generalLedgerAccountTitle,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        });

        let aggregatesQuery = query.clone();

        let result = await(kendoQueryResolve(query, this.paramters, view));

        result.aggregates = await(this.aggregates(aggregatesQuery));

        return result;
    }

    incomesAndOutcomes(){
        let options = this.getOptions(),
            knex = this.knex;

        let query = knex.select().from(function () {
            this.select('generalLedgerAccountId','month', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
                knex.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'))
                .from(function () {
                    groupBy.call(this, knex, options, ['generalLedgerAccountId', 'month']);
                })
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
                .as('final');
        });

        query.whereIn('generalLedgerAccountId', [5,18]);

        query.orderBy('month');

        let view = (item) => ({
            amountType: item.generalLedgerAccountId == 5 ? 'income' : 'outcome',
            month: item.month,
            monthName:  enums.getMonth().getDisplay(item.month),
            amount: item.sumRemainder
        });

        let result = await(query);

        return result.asEnumerable().select(view).toArray();
    }

    subsidiaryLedgerAccount() {
        let knex = this.knex;

        let query = knex.select().from(function () {
            this.select('subsidiaryLedgerAccountId', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
                knex.raw('"subsidiaryLedgerAccounts"."title" as "subsidiaryLedgerAccountTitle"'),
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'))
                .from(function () {
                    groupBy.call(this, knex, this.getOptions(), 'subsidiaryLedgerAccountId');
                })
                .leftJoin('subsidiaryLedgerAccounts', 'subsidiaryLedgerAccounts.id', 'groupJournals.subsidiaryLedgerAccountId')
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .as('final')
        });

        if (eval(filter.notShowZeroRemainder))
            query.whereNot('sumRemainder', 0);

        let view = item => ({
            subsidiaryLedgerAccountId: item.subsidiaryLedgerAccountId,
            subsidiaryLedgerAccountCode: item.subsidiaryLedgerAccountCode,
            subsidiaryLedgerAccountTitle: item.subsidiaryLedgerAccountTitle,
            generalLedgerAccountCode: item.generalLedgerAccountCode,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        });

        let aggregatesQuery = query.clone();

        let result = await(kendoQueryResolve(query, this.paramters, view));

        result.aggregates = await(this.aggregates(aggregatesQuery));

        return result;
    }

    detailAccount() {
        let knex = this.knex;
        let query = knex.select().from(function () {
            this.select('detailAccountId', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"detailAccounts"."code" as "detailAccountCode"'),
                knex.raw('"detailAccounts"."title" as "detailAccountTitle"')
                )
                .from(function () {
                    groupBy.call(this, knex, this.getOptions(), 'detailAccountId');
                })
                .leftJoin('detailAccounts', 'detailAccounts.id', 'groupJournals.detailAccountId')
                .as('final');
        });


        if (eval(filter.notShowZeroRemainder))
            query.whereNot('sumRemainder', 0);

        let view = item => ({
            detailAccountId: item.detailAccountId,
            detailAccountCode: item.detailAccountCode,
            detailAccountTitle: item.detailAccountTitle,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        });

        let aggregatesQuery = query.clone();

        let result = await(kendoQueryResolve(query, this.paramters, view));

        result.aggregates = await(this.aggregates(aggregatesQuery));
    }

    dimension1() {
        let knex = this.knex;

        let query = knex.select().from(function () {
            this.select('dimension1Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"dimensions"."code" as "dimension1Code"'),
                knex.raw('"dimensions"."title" as "dimension1Title"')
                )
                .from(function () {
                    groupBy.call(this, knex, this.getOptions(), 'dimension1Id');
                })
                .leftJoin('dimensions', 'dimensions.id', 'groupJournals.dimension1Id')
                .as('final');
        });

        if (eval(filter.notShowZeroRemainder))
            query.whereNot('sumRemainder', 0);

        let view = item => ({
            dimension1Id: item.dimension1Id,
            dimension1Code: item.dimension1Code,
            dimension1Title: item.dimension1Title,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        });

        let aggregatesQuery = query.clone();

        var result = await(kendoQueryResolve(query, this.paramters, view));

        result.aggregates = await(this.aggregates(aggregatesQuery));

        return result;
    }

    dimension2() {
        let knex = this.knex;

        let query = knex.select().from(function () {
            this.select('dimension2Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"dimensions"."code" as "dimension2Code"'),
                knex.raw('"dimensions"."title" as "dimension2Title"')
                )
                .from(function () {
                    groupBy.call(this, knex, this.getOptions(), 'dimension2Id');
                })
                .leftJoin('dimensions', 'dimensions.id', 'groupJournals.dimension2Id')
                .as('final');
        });


        if (eval(filter.notShowZeroRemainder))
            query.whereNot('sumRemainder', 0);

        let view = item => ({
            dimension2Id: item.dimension2Id,
            dimension2Code: item.dimension2Code,
            dimension2Title: item.dimension2Title,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        });

        let aggregatesQuery = query.clone();

        let result = await(kendoQueryResolve(query, this.paramters, view));

        result.aggregates = await(this.aggregates(aggregatesQuery));

        return result;
    }

    dimension3() {
        let knex = this.knex;
        let query = knex.select().from(function () {
            this.select('dimension3Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"dimensions"."code" as "dimension3Code"'),
                knex.raw('"dimensions"."title" as "dimension3Title"')
                )
                .from(function () {
                    groupBy.call(this, knex, this.getOptions(), 'dimension3Id');
                })
                .leftJoin('dimensions', 'dimensions.id', 'groupJournals.dimension3Id')
                .as('final');
        });


        if (eval(filter.notShowZeroRemainder))
            query.whereNot('sumRemainder', 0);

        let view = item => ({
            dimension3Id: item.dimension3Id,
            dimension3Code: item.dimension3Code,
            dimension3Title: item.dimension3Title,
            sumBeforeRemainder: item.sumBeforeRemainder,
            sumDebtor: item.sumDebtor,
            sumCreditor: item.sumCreditor,
            sumRemainder: item.sumRemainder
        });

        let aggregatesQuery = query.clone();

        let result = await(kendoQueryResolve(query, this.paramters, view));

        result.aggregates = await(this.aggregates(aggregatesQuery));

        return result;
    }

    tiny() {
        let knex = this.knex,
            options = this.getOptions();

        options.groupByField = this.tinyGroupByFields;

        let query = knex.select().from(function () {
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
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
                knex.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'),
                'subsidiaryLedgerAccountId',
                knex.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
                knex.raw('"subsidiaryLedgerAccounts"."title" as "subsidiaryLedgerAccountTitle"'),
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
                'detailAccountId',
                knex.raw('"detailAccounts"."code" as "detailAccountCode"'),
                knex.raw('"detailAccounts"."title" as "detailAccountTitle"'),
                'dimension1Id',
                knex.raw('"dimension1s"."code" as "dimension1Code"'),
                knex.raw('"dimension1s"."title" as "dimension1Title"'),
                'dimension2Id',
                knex.raw('"dimension2s"."code" as "dimension2Code"'),
                knex.raw('"dimension2s"."title" as "dimension2Title"'),
                'dimension3Id',
                knex.raw('"dimension3s"."code" as "dimension3Code"'),
                knex.raw('"dimension3s"."title" as "dimension3Title"')
                )
                .from(function () {
                    groupBy.call(this, knex, options, 'tiny');
                })
                .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
                .leftJoin('subsidiaryLedgerAccounts', 'subsidiaryLedgerAccounts.id', 'groupJournals.subsidiaryLedgerAccountId')
                .leftJoin('detailAccounts', 'detailAccounts.id', 'groupJournals.detailAccountId')
                .leftJoin(knex.raw('"dimensions" as "dimension1s"'), 'dimension1s.id', 'groupJournals.dimension1Id')
                .leftJoin(knex.raw('"dimensions" as "dimension2s"'), 'dimension2s.id', 'groupJournals.dimension2Id')
                .leftJoin(knex.raw('"dimensions" as "dimension3s"'), 'dimension3s.id', 'groupJournals.dimension3Id')
                .orderBy('number')
                .as('final')
        });

        let view = item => ({
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
        });

        let aggregatesQuery = query.clone();

        let result = await(kendoQueryResolve(query, this.paramters, view));

        result.aggregates = await(this.aggregates(aggregatesQuery));

        return result;
    }
};