var KendoFilter = require('../services/kendoFilterResolverService');

function getOrderParameter(sort) {
    if (!sort) return null;

    var order = [];

    sort.forEach(function (s) {
        order.push([s.field, s.dir])
    });

    return order;
}

function getKendoRequestData(query) {
    var parameter = {
        offset: parseInt(query.skip),
        limit: parseInt(query.take)
    };

    if (query.sort) {
        var order = getOrderParameter(query.sort);

        if (order) parameter.order = order;
    }

    if (query.filter) {
        var filterService = new KendoFilter();

        var filter = filterService.resolveFilter(query.filter);

        if (filter) parameter.where = filter;
    }

    return parameter;
}

function toKendoResultData(result) {
    return {
        data: result.rows,
        total: result.count,
        aggregates: null
    }
}

module.exports = {
    getKendoRequestData: getKendoRequestData,
    toKendoResultData: toKendoResultData
};
