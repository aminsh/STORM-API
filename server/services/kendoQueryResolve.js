var knex = require('./knexService');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

function kendoQueryResolve(query, request, mapper) {
    resolveFilter(query, request.filter);

    var count = await(query.clone().count())[0].count;

    resolveLimitAndOffset(query, request.skip, request.take);
    resolveSort(query, request.sort);

    var data = await(query);
    var viewData = data.asEnumerable().select(mapper).toArray();

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


    var methodName = filter.logic = 'and' ? 'andWhere' : 'orWhere';

    filter.filters.forEach(function (f) {
        if (f.logic)
            return resolveFilter(query, filter);

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
                query[methodName](f.field, 'like', '%{0}%'.format(f.value));
                break;
            case 'startswith':
                query[methodName](f.field, 'like', '{0}%'.format(f.value));
                break;
            case 'endswith':
                query[methodName](f.field, 'like', '%{0}'.format(f.value));
                break;
        }
    })
}

function resolveSort(query, sort) {
    if (!sort) return;

    sort.forEach(function (s) {
        query.orderBy(knex.raw(s.field), s.dir);
    });
}

module.exports = async(kendoQueryResolve);
