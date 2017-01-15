var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/account-review/subsidiary-ledger-account',
    handler: (req, res, knex, accountReviewQuery, kendoQueryResolve)=> {
        var filter = (req.query.extra) ? req.query.extra.filter : undefined;

        var dateRange = await(accountReviewQuery.getDateRange(req.cookies['current-period'], filter));
        var options = {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
            fromMainDate: dateRange.fromMainDate,
            filter: filter,
            dateFieldName: 'temporaryDate',
            numberFieldName: 'temporaryNumber',
            groupByField: 'subsidiaryLedgerAccountId'
        };

        var query = knex.select().from(function () {
            this.select('subsidiaryLedgerAccountId', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knex.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
                knex.raw('"subsidiaryLedgerAccounts"."title" as "subsidiaryLedgerAccountTitle"'),
                knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'))
                .from(function () {
                    accountReviewQuery.accountReviewQuery.call(this, options);
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

        result.aggregates = await(accountReviewQuery.aggregates(aggregatesQuery));

        res.json(result);
    }
});

module.exports = router.routes;
