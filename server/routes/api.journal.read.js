
var router = require('../services/routeService').Router(),
    view = require('../viewModel.assemblers/view.journal'),
    enums = require('../constants/enums');

router.route({
    method: 'GET',
    path: '/journals',
    handler: (req, res, knex, kendoQueryResolve)=> {
        var currentFiscalPeriod = req.cookies['current-period'];
        var extra = (req.query.extra) ? req.query.extra.filter : undefined;

        var query = knex.select().from(groupedJournals).as('baseJournals');

        function baseJournals() {
            var q = this.select(
                'journals.id',
                'journals.temporaryNumber',
                'journals.temporaryDate',
                'journals.number',
                'journals.date',
                'journals.description',
                'journals.periodId',
                'journals.createdById',
                'journals.journalStatus',
                'journals.journalType',
                'journals.isInComplete',
                'journalLines.generalLedgerAccountId',
                'journalLines.subsidiaryLedgerAccountId',
                'journalLines.detailAccountId',
                'journalLines.dimension1Id',
                'journalLines.dimension2Id',
                'journalLines.dimension3Id',
                'journalLines.article',
                'journalLines.debtor',
                'journalLines.creditor',
                knex.raw('"cheques"."id" as "chequeId"'),
                knex.raw('"cheques"."date" as "chequeDate"'),
                knex.raw('"cheques"."description" as "chequeDescription"'),
                knex.raw('"users"."name" as "createdBy"')
            ).from('journals')
                .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
                .leftJoin('cheques', 'journalLines.id', 'cheques.journalLineId')
                .leftJoin('users', 'journals.createdById', 'users.id')
                .orderBy('journals.temporaryNumber', 'DESC')
                .as('baseJournals');

            filter(q, extra);
        }

        function groupedJournals() {
            this.select(
                'id',
                'temporaryNumber',
                'temporaryDate',
                'number',
                'date',
                'description',
                'periodId',
                'createdById',
                'journalStatus',
                'journalType',
                'isInComplete'
                //knex.raw('SUM("debtor") as "sumDebtor"'),
                //knex.raw('SUM("creditor") as "sumCreditor"'),
                //knex.raw('"users"."name" as "createdBy"')
            ).from(baseJournals)
                /*.leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
                 .leftJoin('users', 'journals.createdById', 'users.id')
                 .whereExists(knex.select('*').from(baseJournals).whereRaw('"journals"."id" = "baseJournals"."id"'))*/
                .groupBy(
                    'id',
                    'temporaryNumber',
                    'temporaryDate',
                    'number',
                    'date',
                    'description',
                    'periodId',
                    'createdById',
                    'journalStatus',
                    'journalType',
                    'isInComplete')
                .as('groupedJournals');
        }

        function filter(query, filter) {
            var numberOperators = {
                eq: '=',
                gt: '>',
                gte: '>=',
                lt: '<',
                lte: '<='
            };

            if (!filter)
                return query.where('periodId', currentFiscalPeriod);

            if (!filter.isNotPeriodIncluded)
                query.where('periodId', currentFiscalPeriod);

            if (filter.title && filter.title !== '') {
                var value = '%{0}%'.format(filter.title);
                query.andWhereRaw(knex.raw('("journals"."description" LIKE ? OR "journalLines"."article" LIKE ?)',
                    [value, value]));
            }

            if (filter.minNumber && filter.maxNumber)
                query.andWhereBetween('temporaryNumber', [filter.minNumber, filter.maxNumber]);

            if (filter.minDate && filter.maxDate)
                query.andWhereBetween('temporaryDate', [filter.minDate, filter.maxDate]);

            if (filter.generalLedgerAccounts && filter.generalLedgerAccounts.length > 0)
                query.whereIn('generalLedgerAccountId', filter.generalLedgerAccounts);

            if (filter.subsidiaryLedgerAccounts && filter.subsidiaryLedgerAccounts.length > 0)
                query.whereIn('subsidiaryLedgerAccountId', filter.subsidiaryLedgerAccounts);

            if (filter.detailAccounts && filter.detailAccounts.length > 0)
                query.whereIn('detailAccountId', filter.detailAccounts);

            if (filter.dimension1s && filter.dimension1s.length > 0)
                query.whereIn('dimension1Id', filter.dimension1s);

            if (filter.dimension2s && filter.dimension2s.length > 0)
                query.whereIn('dimension2Id', filter.dimension2s);

            if (filter.dimension3s && filter.dimension3s.length > 0)
                query.whereIn('dimension3Id', filter.dimension3s);

            if (filter.chequeNumbers && filter.chequeNumbers.length > 0)
                query.whereIn('chequeId', filter.chequeNumbers);

            if (filter.minChequeDate && filter.maxChequeDate)
                query.andWhereBetween('chequeDate', [filter.minChequeDate, filter.maxChequeDate]);

            if (filter.chequeDescription && filter.chequeDescription !== '')
                query.andWhere('chequeDescription', 'LIKE', '%{0}%'.format(filter.chequeDescription));

            if (filter.amount && filter.amount.value && filter.amount.operator)
                query.andWhereRaw('("journalLines"."debtor" {0} ? OR "journalLines"."creditor" {0} ?)'.format(
                    numberOperators[filter.amount.operator]), [filter.amount.value, filter.amount.value]);
        }

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

router.route({
    method: 'GET',
    path: '/journals/:id',
    handler: (req, res, knex)=> {
        var result = await(knex.select().from('journals').where('id', req.params.id))[0];

        var tagIds = await(knex.select('tagId')
            .from('journalTags')
            .where('journalId', req.params.id))
            .asEnumerable().select(function (t) {
                return t.tagId;
            }).toArray();

        result.tagIds = tagIds;

        var entity = view(result);

        res.json(entity);
    }
});

router.route({
    method: 'GET',
    path: '/journals/summary/grouped-by-month',
    handler: (req, res, knex)=> {
        var currentFiscalPeriod = req.cookies['current-period'];

        var selectExp = '"month",' +
            '"count"(*) as "count",' +
            '"min"("temporaryNumber") as "minNumber",' +
            '"max"("temporaryNumber") as "maxNumber",' +
            '"min"("temporaryDate") as "minDate",' +
            '"max"("temporaryDate") as "maxDate"';

        knex.select(knex.raw(selectExp)).from(function () {
                this.select(knex.raw('*,cast(substring("temporaryDate" from 6 for 2) as INTEGER) as "month"'))
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
});

router.route({
    method: 'GET',
    path: '/journals/month/:month',
    handler: (req, res, knex, kendoQueryResolve)=> {
        var currentFiscalPeriod = req.cookies['current-period'];
        var selectExp = '"id","temporaryNumber","temporaryDate","number","date","description",' +
            'CASE WHEN "journalStatus"=\'Fixed\' THEN TRUE ELSE FALSE END as "isFixed",' +
            'CASE WHEN "attachmentFileName" IS NOT NULL THEN TRUE ELSE FALSE END as "hasAttachment",' +
            '(select "sum"("debtor") from "journalLines" WHERE "journalId" = journals."id") as "sumAmount",' +
            '(select "count"(*) from "journalLines" WHERE "journalId" = journals."id") as "countOfRows"';

        var query = knex.select().from(function () {
            this.select(knex.raw(selectExp)).from('journals')
                .where(knex.raw('cast(substring("temporaryDate" from 6 for 2) as INTEGER)'), req.params.month)
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
});

router.route({
    method: 'GET',
    path: '/journals/period/:periodId',
    handler: (req, res, knex, kendoQueryResolve)=> {
        var currentFiscalPeriod = req.params.periodId;
        var query = knex.select().from(function () {
            this.select().from('journals')
                .where('periodId', currentFiscalPeriod)
                .orderBy('temporaryNumber', 'desc')
                .as('baseJournals');
        }).as('baseJournals');

        kendoQueryResolve(query, req.query, view)
            .then(function (result) {
                res.json(result);
            });
    }
});

module.exports = router.routes;

