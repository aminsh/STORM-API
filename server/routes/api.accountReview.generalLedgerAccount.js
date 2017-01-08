var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/account-review/general-ledger-account',
    handler: (req, res, knexService, accountReviewQuery, kendoQueryResolve)=> {
        var filter = (req.query.extra) ? req.query.extra.filter : undefined;

        var dateRange = await(accountReviewQuery.getDateRange(req.cookies['current-period'], filter));
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
                    accountReviewQuery.accountReviewQuery.call(this, options);
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

        result.aggregates = await(accountReviewQuery.aggregates(aggregatesQuery));

        res.json(result);
    }
});

module.exports = router.routes;