var async = require('asyncawait/async');
var await = require('asyncawait/await');

function kendoQueryResolve(query, request, mapper) {
    request = request || {};

    request.paging = request.hasOwnProperty('paging') ? eval(request.paging) : true;

    resolveFilter(query, request.filter);

    var count = request.paging ? await(query.clone().count())[0].count : 0,

        isFirst = request.hasOwnProperty('first');

    request.take = isFirst ? 1 : request.take;

    if (request.paging)
        resolveLimitAndOffset(query, request.skip, request.take);

    resolveSort(query, request.sort);

    var viewData = await(query.map(mapper));

    if(isFirst)
        return viewData[0];

    if(!request.paging)
        return viewData;

    return {
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
            case 'isNull':
                query[filter.logic === 'or' ? 'orWhereNull' : 'whereNull'](f.field);
                break;
            case 'isNotNull':
                query[filter.logic === 'or' ? 'orWhereNotNull' : 'whereNotNull'](f.field);
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
