var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/account-review/dimension-2',
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
            groupByField: 'dimension2Id'
        };

        var query = knexService.select().from(function () {
            this.select('dimension2Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knexService.raw('"dimensions"."code" as "dimension2Code"'),
                knexService.raw('"dimensions"."title" as "dimension2Title"')
                )
                .from(function () {
                    accountReviewQuery.accountReviewQuery.call(this, options);
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

        result.aggregates = await(accountReviewQuery.aggregates(aggregatesQuery));

        res.json(result);
    }
});

module.exports = router.routes;