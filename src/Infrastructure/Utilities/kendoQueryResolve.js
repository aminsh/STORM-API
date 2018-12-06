import toAsync from "asyncawait/async";
import toResult from "asyncawait/await";

const kendoQueryResolve = toAsync(function kendoQueryResolve(query, request, mapper) {
    request = request || {};

    request.paging = request.hasOwnProperty('paging') ? eval(request.paging) : true;

    resolveFilter(query, request.filter);

    var count = request.paging ? toResult(query.clone().count())[0].count : 0,

        isFirst = request.hasOwnProperty('first');

    request.take = isFirst ? 1 : request.take;

    if (request.paging)
        resolveLimitAndOffset(query, request.skip, request.take);

    resolveSort(query, request.sort);

    var viewData = toResult(query.map(mapper));

    if (isFirst)
        return viewData[0];

    if (!request.paging)
        return viewData;

    return {
        data: viewData,
        total: count
    }
});

export default kendoQueryResolve;

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

        if (s.hasOwnProperty('value')) {

            const value = typeof s.value === 'string' ? `'${s.value}'` : s.value;

            query.orderByRaw(`CASE WHEN "${s.field}" = ${value} THEN 1 ELSE 2 END ${s.dir}`);
        }
        else
            query.orderBy(s.field, s.dir);
    });
}

