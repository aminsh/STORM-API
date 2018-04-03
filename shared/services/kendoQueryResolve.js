var async = require('asyncawait/async');
var await = require('asyncawait/await');

function kendoQueryResolve(query, request, mapper) {
    request = request || {};

    resolveFilter(query, request.filter);

    var count = await(query.clone().count())[0].count,
        isFirst = request.hasOwnProperty('first');

    request.take = isFirst ? 1 : request.take;

    resolveLimitAndOffset(query, request.skip, request.take);
    resolveSort(query, request.sort);

    var viewData = await(query.map(mapper));


    return isFirst ? viewData[0] : {
        data: viewData,
        total: count
    }
}

function resolveLimitAndOffset(query, offset, limit) {
    if (offset) query.offset(offset);
    if (limit) query.limit(limit);
}

function resolveFilter(query, filter) {
    if (!filter || !filter.logic || !filter.filters)
        return;

    if (filter.filters.length == 0)
        return;


    var methodName = filter.logic === 'and' ? 'andWhere' : 'orWhere';

    filter.filters.forEach(function (f) {
        if (f.logic)
            return resolveFilter(query, f);

        switch (f.operator) {
            case 'eq':
                query[methodName](f.field, f.value);
                break;
            case 'gt':
                query[methodName](f.field, '>', f.value);
                break;
            case 'gte':
                query[methodName](f.field, '>=', f.value);
                break;
            case 'lt':
                query[methodName](f.field, '<', f.value);
                break;
            case 'lte':
                query[methodName](f.field, '<=', f.value);
                break;
            case 'contains':
                query[methodName](f.field, 'ilike', '%{0}%'.format(f.value));
                break;
            case 'startswith':
                query[methodName](f.field, 'ilike', '{0}%'.format(f.value));
                break;
            case 'endswith':
                query[methodName](f.field, 'ilike', '%{0}'.format(f.value));
                break;
        }
    })
}

function resolveSort(query, sort) {
    if (!sort) return;

    sort.forEach(function (s) {
        query.orderBy(s.field, s.dir);
    });
}

module.exports = async(kendoQueryResolve);
