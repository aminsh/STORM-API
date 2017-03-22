"use strict";

const baseJournals = require('./query.journal.base');

module.exports = function (knex, options, currentFiscalPeriod) {
    let amountFields = _getAmountFields(knex, options);

    this.select(
        'id',
        'date',
        'month',
        'number',
        'description',
        'periodId',
        'isInComplete',
        'createdById',
        'journalStatus',
        'journalType',
        'generalLedgerAccountId',
        'subsidiaryLedgerAccountId',
        'detailAccountId',
        'dimension1Id',
        'dimension2Id',
        'dimension3Id',
        'article',
        'row',
        'chequeId',
        'chequeDate',
        'chequeDescription',
        'createdBy',
        amountFields.debtor,
        amountFields.creditor,
        amountFields.beforeRemainder
    ).from(function () {
        baseJournals.call(this, knex, options);
    })
        .whereBetween('date', [options.fromDate, options.toDate])
        .as('dateControlJournals');

    _executeFilter(this, options.filter, currentFiscalPeriod);
};

function _getAmountFields(knex, options) {
    if (options.groupByField == 'tiny')
        return {
            beforeRemainder: knex.raw('0 as "beforeRemainder"'),
            creditor: 'creditor',
            debtor: 'debtor'
        };

    let beforeRemainder = `CASE WHEN "date" < '${options.fromMainDate}'
        THEN "debtor"  -  "creditor" 
        ELSE 0 END as "beforeRemainder"`;

    let debtor = `CASE WHEN "date" >= '${options.fromMainDate}' THEN "debtor" ELSE 0 END as "debtor"`;
    let creditor = `CASE WHEN "date" >= '${options.fromMainDate}' THEN "creditor" ELSE 0 END as "creditor"`;

    return {
        beforeRemainder: knex.raw(beforeRemainder),
        creditor: knex.raw(creditor),
        debtor: knex.raw(debtor)
    };
}

function _executeFilter(query, filter, currentFiscalPeriod) {
    var numberOperators = {
        eq: '=',
        gt: '>',
        gte: '>=',
        lt: '<',
        lte: '<='
    };
    query.andWhere('isInComplete', false);

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

    if (filter.chequeNumbers && filter.chequeNumbers.length > 0)
        query.whereIn('chequeId', filter.chequeNumbers);

    if (filter.minChequeDate && filter.maxChequeDate)
        query.andWhereBetween('chequeDate', [filter.minChequeDate, filter.maxChequeDate]);

    if (filter.chequeDescription && filter.chequeDescription !== '')
        query.andWhere('chequeDescription', 'LIKE', '%{0}%'.format(filter.chequeDescription));

    if (filter.amount && filter.amount.value && filter.amount.operator)
        query.andWhereRaw('("debtor" {0} ? OR "creditor" {0} ?)'.format(
            numberOperators[filter.amount.operator]), [filter.amount.value, filter.amount.value]);

}