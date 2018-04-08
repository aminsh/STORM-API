"use strict";

module.exports = function(knex, branchId) {
    this.select(
        'journalLines.id',
        'journalLines.journalId',
        'journalLines.row',
        'journalLines.article',
        'journalLines.debtor',
        'journalLines.creditor',
        'journalLines.generalLedgerAccountId',
        'journalLines.subsidiaryLedgerAccountId',
        knex.raw('"generalLedgerAccounts"."code" as "generalLedgerAccountCode"'),
        knex.raw('"generalLedgerAccounts"."code" || \' \' || "generalLedgerAccounts"."title" as "generalLedgerAccountDisplay"'),
        'journalLines.subsidiaryLedgerAccountId',
        knex.raw('"subsidiaryLedgerAccounts"."code" as "subsidiaryLedgerAccountCode"'),
        knex.raw('"subsidiaryLedgerAccounts".code || \' \' || "subsidiaryLedgerAccounts".title as "subsidiaryLedgerAccountDisplay"'),
        'journalLines.detailAccountId',
        knex.raw('"detailAccounts"."code" as "detailAccountCode"'),
        knex.raw(`coalesce("detailAccounts"."code",'') || ' ' || "detailAccounts"."title" as "detailAccountDisplay"`),
        'journalLines.dimension1Id',
        knex.raw('"dimension1s"."code" || \' \' || "dimension1s"."title" as "dimension1Display"'),
        'journalLines.dimension2Id',
        knex.raw('"dimension2s"."code" || \' \' || "dimension2s"."title" as "dimension2Display"'),
        'journalLines.dimension3Id',
        knex.raw('"dimension3s"."code" || \' \' || "dimension3s"."title" as "dimension3Display"')
    ).from('journalLines')
        .leftJoin('generalLedgerAccounts', 'journalLines.generalLedgerAccountId', 'generalLedgerAccounts.id')
        .leftJoin('subsidiaryLedgerAccounts', 'journalLines.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
        .leftJoin('detailAccounts', 'journalLines.detailAccountId', 'detailAccounts.id')
        .leftJoin(knex.raw('"dimensions" as "dimension1s"'), 'journalLines.dimension1Id', 'dimension1s.id')
        .leftJoin(knex.raw('"dimensions" as "dimension2s"'), 'journalLines.dimension2Id', 'dimension2s.id')
        .leftJoin(knex.raw('"dimensions" as "dimension3s"'), 'journalLines.dimension3Id', 'dimension3s.id')
        .where('journalLines.branchId', branchId)
        .orderBy('journalLines.row')
        .as('baseJournalLines');
};