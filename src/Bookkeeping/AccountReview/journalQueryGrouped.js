import filterJournals from "./journalQueryReportFilter";

export default function (knex, options, currentFiscalPeriod, groupByFields) {
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
            'createdBy'
        ];

    this.select([
        knex.raw('SUM("beforeRemainder") as "sumBeforeRemainder"'),
        knex.raw('SUM("debtor") as "sumDebtor"'),
        knex.raw('SUM("debtor" -"creditor" ) as "remainder"'),
        knex.raw('SUM("creditor" ) as "sumCreditor"'),
        knex.raw('SUM("beforeDebtor" ) as "sumBeforeDebtor"'),
        knex.raw('SUM("beforeCreditor" ) as "sumBeforeCreditor"'),
        knex.raw('SUM("beforeDebtor" ) + SUM("debtor" ) as "totalDebtorRemainder"'),
        knex.raw('SUM("beforeCreditor" ) + SUM("creditor" ) as "totalCreditorRemainder"'),
        knex.raw('(SUM("beforeDebtor" ) + SUM("debtor" )) - (SUM("beforeCreditor" ) + SUM("creditor" )) as "totalRemainder"'),
        knex.raw('SUM("beforeRemainder" ) + SUM("debtor" ) - SUM("creditor") as "sumRemainder"'),
    ].concat(groupByField))
        .from(function () {
        filterJournals.call(this, knex, options, currentFiscalPeriod);
    })
        .groupBy(groupByField)
        .orderBy(groupByField)
        .as('groupJournals');
};