"use strict";

const baseJournals = require('./query.accountReview.base');

module.exports = function (knex, options) {
    let amountFields = _getAmountFields(knex, options);

    this.select(
        'id',
        'date',
        'month',
        'number',
        'description',
        'periodId',
        'isInComplete',
        'journalStatus',
        'journalType',
        'generalLedgerAccountId',
        'subsidiaryLedgerAccountId',
        'detailAccountId',
        'dimension1Id',
        'dimension2Id',
        'dimension3Id',
        'article',
        amountFields.beforeRemainder,
        amountFields.debtor,
        amountFields.creditor
    ).from(function () {
            baseJournals.call(this, knex, options);
        })
        .whereBetween('date', [options.fromDate, options.toDate])
        .as('dateControlJournals');

    _executeFilter(this, options.filter);
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

function _executeFilter(query, filter) {
    query.andWhere('isInComplete', false);

    if (filter.minNumber && filter.maxNumber)
        query.andWhereBetween('number', [filter.minNumber, filter.maxNumber]);

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
}