"use strict";

const filter = require('./query.journal.filter');

module.exports = function(extra, currentFiscalPeriodId, knex) {
    var q = this.select(
        'journals.id',
        'journals.temporaryNumber',
        'journals.temporaryDate',
        'journals.number',
        'journals.date',
        'journals.description',
        'journals.periodId',
        'journals.createdById',
        'journals.journalStatus',
        'journals.journalType',
        'journals.isInComplete',
        'journalLines.generalLedgerAccountId',
        'journalLines.subsidiaryLedgerAccountId',
        'journalLines.detailAccountId',
        'journalLines.dimension1Id',
        'journalLines.dimension2Id',
        'journalLines.dimension3Id',
        'journalLines.article',
        'journalLines.debtor',
        'journalLines.creditor',
        knex.raw('"cheques"."id" as "chequeId"'),
        knex.raw('"cheques"."date" as "chequeDate"'),
        knex.raw('"cheques"."description" as "chequeDescription"'),
        knex.raw('"users"."name" as "createdBy"')
    ).from('journals')
        .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
        .leftJoin('cheques', 'journalLines.id', 'cheques.journalLineId')
        .leftJoin('users', 'journals.createdById', 'users.id')
        .orderBy('journals.temporaryNumber', 'DESC')
        .as('baseJournals');

    filter(q, extra, currentFiscalPeriodId , knex);
};