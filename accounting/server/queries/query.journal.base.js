"use strict";

module.exports = function (knex, options) {
    this.select(
        'journals.id',
        knex.raw(`"journals"."${options.numberFieldName}" as "number"`),
        knex.raw(`"journals"."${options.dateFieldName}" as "date"`),
        knex.raw(`cast(substring("journals"."${options.dateFieldName}" from 6 for 2) as INTEGER) as "month"`),
        'journals.description',
        'journals.periodId',
        'journals.isInComplete',
        'journals.createdById',
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
        'journalLines.creditor',
        'journalLines.row',
        knex.raw(`"cheques"."id" as "chequeId"`),
        knex.raw(`"cheques"."date" as "chequeDate"`),
        knex.raw(`"cheques"."description" as "chequeDescription"`),
        knex.raw(`"users"."name" as "createdBy"`)
    ).from('journals')
        .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
        .leftJoin('cheques', 'journalLines.id', 'cheques.journalLineId')
        .leftJoin('users', 'journals.createdById', 'users.id')
        .orderBy('number', 'DESC')
        .as('baseJournals');
};