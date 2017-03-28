"use strict";

const baseJournals = require('./query.journal.base'),
    baseFilter = require('./query.journal.baseFilter');

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
        amountFields.beforeRemainder,
        amountFields.beforeCreditor,
        amountFields.beforeDebtor
    ).from(function () {
        baseJournals.call(this, knex, options);
    })
        .whereBetween('date', [options.fromDate, options.toDate])
        .as('dateControlJournals');

    _executeFilter(this, options.filter, currentFiscalPeriod, knex);
};

function _getAmountFields(knex, options) {
    if (options.groupByField == 'tiny')
        return {
            beforeRemainder: knex.raw('0 as "beforeRemainder"'),
            creditor: 'creditor',
            beforeCreditor: 0,
            debtor: 'debtor',
            beforeDebtor: 0
        };

    let beforeRemainder = `CASE WHEN "date" < '${options.fromMainDate}'
        THEN "debtor"  -  "creditor" 
        ELSE 0 END as "beforeRemainder"`;

    let beforeDebtor = `CASE WHEN "date" < '${options.fromMainDate}' THEN "debtor" ELSE 0 END as "beforeDebtor"`;
    let beforeCreditor = `CASE WHEN "date" < '${options.fromMainDate}' THEN "creditor" ELSE 0 END as "beforeCreditor"`;

    let debtor = `CASE WHEN "date" >= '${options.fromMainDate}' THEN "debtor" ELSE 0 END as "debtor"`;
    let creditor = `CASE WHEN "date" >= '${options.fromMainDate}' THEN "creditor" ELSE 0 END as "creditor"`;

    return {
        beforeRemainder: knex.raw(beforeRemainder),
        creditor: knex.raw(creditor),
        beforeCreditor: knex.raw(beforeCreditor),
        debtor: knex.raw(debtor),
        beforeDebtor: knex.raw(beforeDebtor)
    };
}

function _executeFilter(query, filter, currentFiscalPeriod, knex) {
        query.andWhere('isInComplete', false);
        baseFilter(query, filter, currentFiscalPeriod , knex);
}