"use strict";

module.exports = function (knex, options) {
    this.select(
        'journals.id',
        knex.raw(`"journals"."${options.numberFieldName}" as number`),
        knex.raw(`"journals"."${options.dateFieldName}" as date`),
        knex.raw(`cast(substring("${options.dateFieldName}" from 6 for 2) as INTEGER) as "month"`),
        'journals.description',
        'journals.periodId',
        'journals.isInComplete',
        'journals.journalStatus',
        'journals.journalType',
        'journalLines.generalLedgerAccountId',
        'journalLines.subsidiaryLedgerAccountId',
        'journalLines.detailAccountId',
        'journalLines.dimension1Id',
        'journalLines.dimension2Id',
        'journalLines.dimension3Id',
        'journalLines.article',
        'journalLines.debtor',
        'journalLines.creditor'
    ).from('journals')
        .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
        .as('baseJournals');
};