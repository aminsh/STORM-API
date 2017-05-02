"use strict";

module.exports = function (query, filter, currentFiscalPeriod,knex) {
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
        query.andWhereBetween('number', [filter.minNumber, filter.maxNumber]);

    if (filter.minDate && filter.maxDate)
        query.andWhereBetween('date', [filter.minDate, filter.maxDate]);

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

    if (filter.generalLedgerAccountId)
        query.andWhere('generalLedgerAccountId', filter.generalLedgerAccountId);

    if (filter.subsidiaryLedgerAccountId)
        query.andWhere('subsidiaryLedgerAccountId', filter.subsidiaryLedgerAccountId);

    if (filter.detailAccountId)
        query.andWhere('detailAccountId', filter.detailAccountId);

    if (filter.dimension1Id)
        query.andWhere('dimension1Id', filter.dimension1Id);

    if (filter.dimension2Id)
        query.andWhere('dimension2Id', filter.dimension2Id);

    if (filter.dimension3Id)
        query.andWhere('dimension3Id', filter.dimension3Id);
};