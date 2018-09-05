import toResult from "asyncawait/await";
import {inject, injectable} from "inversify";
import {BaseQuery} from "../../Infrastructure/BaseQuery";
import groupBy from "./journalQueryGrouped";

@injectable()
export class AccountReviewQuery extends BaseQuery {

    @inject("FiscalPeriodQuery")
    /**@type{FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;
    
    @inject("Enums") enums = undefined;

    /**
     * @type {{isNotPeriodIncluded:Boolean, minDate: String, maxDate: String}}*/
    get filter() {

        const parameters = this.state.request.query;

        return (parameters.extra) ? parameters.extra.filter : {}
    }

    get options() {

        let dateRange = this.dateRange,
            mode = this.mode || 'create';
        return {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
            fromMainDate: dateRange.fromMainDate,
            filter: this.filter,
            dateFieldName: mode == 'create' ? 'temporaryDate' : 'date',
            numberFieldName: mode == 'create' ? 'temporaryNumber' : 'number',
            branchId: this.branchId
        };
    }

    get dateRange() {

        const currentPeriod = this.fiscalPeriodQuery.getById(this.state.fiscalPeriodId),
            filter = this.filter;


        if (!eval(filter.isNotPeriodIncluded))
            return {
                fromDate: currentPeriod.minDate,
                fromMainDate: (filter.minDate && filter.minDate >= currentPeriod.minDate)
                    ? filter.minDate
                    : currentPeriod.minDate,
                toDate: (filter.maxDate && filter.maxDate <= currentPeriod.maxDate)
                    ? filter.maxDate
                    : "9999/99/99"
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

        const knex = this.knex;

        const aggregates = toResult(
            query.select(
                knex.raw('SUM("sumBeforeRemainder") as "totalBeforeRemainder"'),
                knex.raw('SUM("sumDebtor") as "totalDebtor"'),
                knex.raw('SUM("sumCreditor") as "totalCreditor"'),
                knex.raw('SUM("sumRemainder") as "totalRemainder"')
            ).first()
        );

        return {
            sumBeforeRemainder: {sum: aggregates.totalBeforeRemainder},
            sumDebtor: {sum: aggregates.totalDebtor},
            sumCreditor: {sum: aggregates.totalCreditor},
            sumRemainder: {sum: aggregates.totalRemainder}
        };
    }

    generalLedgerAccount() {
        let options = this.options,
            knex = this.knex,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let query = knex.select().from(function () {
            this.select('generalLedgerAccountId',
                'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
                knex.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'))
                .from(function () {
                    groupBy.call(this, knex, options, fiscalPeriodId, 'generalLedgerAccountId')
                })
                .innerJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
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

        let result = toResult(Utility.kendoQueryResolve(query, this.paramters, view));

        result.aggregates = this.aggregates(aggregatesQuery);

        return result;
    }

    incomesAndOutcomes() {
        const options = this.options,
            knex = this.knex,
            enums = this.enums,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let query = knex.select().from(function () {
            this.select('generalLedgerAccountId', 'month', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
                knex.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'))
                .from(function () {
                    groupBy.call(this, knex, options, fiscalPeriodId, ['generalLedgerAccountId', 'month']);
                })
                .innerJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
                .as('final');
        });

        query.whereIn('generalLedgerAccountId', [5, 18]);

        query.orderBy('month');

        let view = (item) => ({
            amountType: item.generalLedgerAccountId == 5 ? 'income' : 'outcome',
            month: item.month,
            monthName: enums.getMonth().getDisplay(item.month),
            amount: item.sumRemainder
        });

        let result = toResult(query);

        return result.asEnumerable().select(view).toArray();
    }

    subsidiaryLedgerAccount() {
        let knex = this.knex,
            options = this.options,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let query = knex.select().from(function () {
            this.select('subsidiaryLedgerAccountId',
                'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
                knex.raw('"subsidiaryLedgerAccounts"."title" as "subsidiaryLedgerAccountTitle"'),
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'))
                .from(function () {
                    groupBy.call(this, knex, options, fiscalPeriodId, 'subsidiaryLedgerAccountId');
                })
                .innerJoin('subsidiaryLedgerAccounts', 'subsidiaryLedgerAccounts.id', 'groupJournals.subsidiaryLedgerAccountId')
                .innerJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'subsidiaryLedgerAccounts.generalLedgerAccountId')
                .as('final')
        });

        if (eval(this.filter.notShowZeroRemainder))
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

        let result = toResult(Utility.kendoQueryResolve(query, this.paramters, view));

        result.aggregates = this.aggregates(aggregatesQuery);

        return result;
    }

    detailAccount() {
        let knex = this.knex,
            options = this.options,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let query = knex.select().from(function () {
            this.select('detailAccountId',
                'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"detailAccounts"."code" as "detailAccountCode"'),
                knex.raw('"detailAccounts"."title" as "detailAccountTitle"')
            )
                .from(function () {
                    groupBy.call(this, knex, options, fiscalPeriodId, 'detailAccountId');
                })
                .innerJoin('detailAccounts', 'detailAccounts.id', 'groupJournals.detailAccountId')
                .as('final');
        });


        if (eval(this.filter.notShowZeroRemainder))
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

        let result = toResult(Utility.kendoQueryResolve(query, this.paramters, view));

        result.aggregates = this.aggregates(aggregatesQuery);

        return result;
    }

    dimension1() {
        let knex = this.knex,
            options = this.options,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let query = knex.select().from(function () {
            this.select('dimension1Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"dimensions"."code" as "dimension1Code"'),
                knex.raw('"dimensions"."title" as "dimension1Title"')
            )
                .from(function () {
                    groupBy.call(this, knex, options, fiscalPeriodId, 'dimension1Id');
                })
                .innerJoin('dimensions', 'dimensions.id', 'groupJournals.dimension1Id')
                .as('final');
        });

        if (eval(this.filter.notShowZeroRemainder))
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

        var result = toResult(Utility.kendoQueryResolve(query, this.paramters, view));

        result.aggregates = this.aggregates(aggregatesQuery);

        return result;
    }

    dimension2() {
        let knex = this.knex,
            options = this.options,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView();
        options.modify = this.modify;

        let query = knex.select().from(function () {
            this.select('dimension2Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"dimensions"."code" as "dimension2Code"'),
                knex.raw('"dimensions"."title" as "dimension2Title"')
            )
                .from(function () {
                    groupBy.call(this, knex, options, fiscalPeriodId, 'dimension2Id');
                })
                .innerJoin('dimensions', 'dimensions.id', 'groupJournals.dimension2Id')
                .as('final');
        });


        if (eval(this.filter.notShowZeroRemainder))
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

        let result = toResult(Utility.kendoQueryResolve(query, this.paramters, view));

        result.aggregates = this.aggregates(aggregatesQuery);

        return result;
    }

    dimension3() {
        let knex = this.knex,
            options = this.options,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);

        let query = knex.select().from(function () {
            this.select('dimension3Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"dimensions"."code" as "dimension3Code"'),
                knex.raw('"dimensions"."title" as "dimension3Title"')
            )
                .from(function () {
                    groupBy.call(this, knex, options, fiscalPeriodId, 'dimension3Id');
                })
                .innerJoin('dimensions', 'dimensions.id', 'groupJournals.dimension3Id')
                .as('final');
        });


        if (eval(this.filter.notShowZeroRemainder))
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

        let result = toResult(Utility.kendoQueryResolve(query, this.paramters, view));

        result.aggregates = this.aggregates(aggregatesQuery);

        return result;
    }

    tiny() {
        let knex = this.knex,
            options = this.options,
            fiscalPeriodId = this.state.fiscalPeriodId;

        options.branchId = this.branchId;
        options.userId = this.userId;
        options.canView = this.canView.call(this);
        options.modify = this.modify.bind(this);
        //options.groupByField = this.tinyGroupByFields;

        let withQuery = knex.with('journals-row', (qb) => {
                qb.select(
                    'groupJournals.id',
                    'date',
                    'number',
                    'article',
                    'periodId',
                    'journalStatus',
                    'journalType',
                    'sumBeforeRemainder',
                    'sumDebtor',
                    'sumCreditor',
                    'sumRemainder',
                    'groupJournals.generalLedgerAccountId',
                    knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
                    knex.raw('"generalLedgerAccounts"."title" as "generalLedgerAccountTitle"'),
                    'subsidiaryLedgerAccountId',
                    knex.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
                    knex.raw('"subsidiaryLedgerAccounts"."title" as "subsidiaryLedgerAccountTitle"'),
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
                    knex.raw('"dimension3s"."title" as "dimension3Title"'),
                    knex.raw(`ROW_NUMBER () OVER (ORDER BY "temporaryNumber") as "seq_row"`)
                )
                    .from(function () {
                        groupBy.call(this, knex, options, fiscalPeriodId, 'tiny');
                    })
                    .leftJoin('generalLedgerAccounts', 'generalLedgerAccounts.id', 'groupJournals.generalLedgerAccountId')
                    .leftJoin('subsidiaryLedgerAccounts', 'subsidiaryLedgerAccounts.id', 'groupJournals.subsidiaryLedgerAccountId')
                    .leftJoin('detailAccounts', 'detailAccounts.id', 'groupJournals.detailAccountId')
                    .leftJoin(knex.raw('"dimensions" as "dimension1s"'), 'dimension1s.id', 'groupJournals.dimension1Id')
                    .leftJoin(knex.raw('"dimensions" as "dimension2s"'), 'dimension2s.id', 'groupJournals.dimension2Id')
                    .leftJoin(knex.raw('"dimensions" as "dimension3s"'), 'dimension3s.id', 'groupJournals.dimension3Id')
                    .orderBy('temporaryNumber','temporaryDate')
            }),

            query = withQuery.select().from(function () {
                this.select('*',
                    knex.raw(`(select sum("sumRemainder") 
                        from "journals-row" 
                        where "seq_row" <= base."seq_row" and "detailAccountId" = base."detailAccountId") as remainder`))
                    .from('journals-row as base')
                    .groupBy(
                        'id',
                        'date',
                        'number',
                        'article',
                        'periodId',
                        'journalStatus',
                        'journalType',
                        'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                        'generalLedgerAccountId', 'generalLedgerAccountCode', 'generalLedgerAccountTitle',
                        'subsidiaryLedgerAccountId', 'subsidiaryLedgerAccountCode', 'subsidiaryLedgerAccountTitle',
                        'detailAccountId', 'detailAccountCode', 'detailAccountTitle',
                        'dimension1Id', 'dimension1Code', 'dimension1Title',
                        'dimension2Id', 'dimension2Code', 'dimension2Title',
                        'dimension3Id', 'dimension3Code', 'dimension3Title',
                        'seq_row'
                    )
                    .orderBy('base.seq_row', 'desc')
                    .as('baseQuery')
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
            sumRemainder: item.sumRemainder,
            remainder: item.remainder
        });

        let aggregatesQuery = query.clone();

        let result = toResult(Utility.kendoQueryResolve(query, this.paramters, view));

        result.aggregates = this.aggregates(aggregatesQuery);

        return result;
    }


}