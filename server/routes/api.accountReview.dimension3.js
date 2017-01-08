var router = require('../services/routeService').Router();

router.route({
    method: 'GET',
    path: '/account-review/dimension-3',
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
            groupByField: 'dimension3Id'
        };

        var query = knexService.select().from(function () {
            this.select('dimension3Id', 'sumBeforeRemainder', 'sumDebtor', 'sumCreditor', 'sumRemainder',
                knexService.raw('"dimensions"."code" as "dimension3Code"'),
                knexService.raw('"dimensions"."title" as "dimension3Title"')
                )
                .from(function () {
                    accountReviewQuery.accountReviewQuery.call(this, options);
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

        result.aggregates = await(accountReviewQuery.aggregates(aggregatesQuery));

        res.json(result);
    }
});

module.exports = router.routes;