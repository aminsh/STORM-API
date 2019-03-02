export default function (knex, options) {
    this.select(
        'journals.id',
        knex.raw(`"journals"."${options.numberFieldName}" as "number"`),
        knex.raw(`"journals"."${options.dateFieldName}" as "date"`),
        knex.raw(`cast(substring("journals"."${options.dateFieldName}" from 6 for 2) as INTEGER) as "month"`),
        'journals.temporaryNumber',
        'journals.temporaryDate',
        'journals.issuer',
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
        knex.raw(`"users"."name" as "createdBy"`)
    ).from('journals')
        .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
        .leftJoin('users', 'journals.createdById', 'users.id')
        .modify(options.modify, options.branchId, options.userId, options.canView, 'journals')
        //.orderBy('number', 'DESC')
        .as('baseJournals');
}