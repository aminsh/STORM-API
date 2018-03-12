"use strict";

const filterJournals = require('./query.journal.reportFilter');

module.exports = function (knex, options, currentFiscalPeriod, groupByFields) {
    let groupByField = groupByFields != 'tiny'
        ? groupByFields
        : [
            'id',
            'date',
            'month',
            'number',
            'temporaryNumber',
            'temporaryDate',
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
            'createdBy'
        ];

    this.select([
        knex.raw('SUM(cast("beforeRemainder" as float)) as "sumBeforeRemainder"'),
        knex.raw('SUM(cast("debtor" as float)) as "sumDebtor"'),
        knex.raw('SUM(cast("debtor" as float)-cast("creditor" as float)) as "remainder"'),
        knex.raw('SUM(cast("creditor" as float)) as "sumCreditor"'),
        knex.raw('SUM(cast("beforeDebtor" as float)) as "sumBeforeDebtor"'),
        knex.raw('SUM(cast("beforeCreditor" as float)) as "sumBeforeCreditor"'),
        knex.raw('SUM(cast("beforeDebtor" as float)) + SUM(cast("debtor" as float)) as "totalDebtorRemainder"'),
        knex.raw('SUM(cast("beforeCreditor" as float)) + SUM(cast("creditor" as float)) as "totalCreditorRemainder"'),
        knex.raw('(SUM(cast("beforeDebtor" as float)) + SUM(cast("debtor" as float))) - (SUM(cast("beforeCreditor" as float)) + SUM(cast("creditor" as float))) as "totalRemainder"'),
        knex.raw('SUM(cast("beforeRemainder" as float)) + SUM(cast("debtor" as float)) - SUM(cast("creditor" as float)) as "sumRemainder"'),
    ].concat(groupByField))
        .from(function () {
        filterJournals.call(this, knex, options, currentFiscalPeriod);
    })
        .groupBy(groupByField)
        .orderBy(groupByField)
        .as('groupJournals');
};