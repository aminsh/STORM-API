"use strict";

const filterJournals = require('./query.accountReview.filter');

module.exports = function (knex, options, groupByFields) {
    let groupByField = groupByFields != 'tiny'
        ? groupByFields
        : [
            'id',
            'date',
            'number',
            'description',
            'periodId',
            'journalStatus',
            'journalType',
            'generalLedgerAccountId',
            'subsidiaryLedgerAccountId',
            'detailAccountId',
            'dimension1Id',
            'dimension2Id',
            'dimension3Id',
            'article'
        ];

    this.select([
        knex.raw('SUM("beforeRemainder") as "sumBeforeRemainder"'),
        knex.raw('SUM("debtor") as "sumDebtor"'),
        knex.raw('SUM("creditor") as "sumCreditor"'),
        knex.raw('SUM("beforeRemainder") + SUM("debtor") - SUM("creditor") as "sumRemainder"')
    ].concat(groupByField)).from(() => filterJournals.call(this, knex, options))
        .groupBy(groupByField)
        .orderBy(groupByField)
        .as('groupJournals');
};