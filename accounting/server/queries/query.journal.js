"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.journal'),
    enums = instanceOf('Enums'),
    journalBase = require('./query.journal.base'),
    journalBaseFilter = require('./query.journal.baseFilter');

class JournalQuery extends BaseQuery {
    constructor(branchId) {
        super(branchId);
    }

    getMaxNumber(fiscalPeriodId) {
        let maxNumber = await(this.knex.table('journals')
            .andWhere('branchId', this.branchId)
            .where('periodId', fiscalPeriodId)
            .max('temporaryNumber'))[0].max;
        return maxNumber;
    }

    batchFindById(journalId) {
        let knex = this.knex,
            journalLines = await(knex.select(
                'id',
                'row',
                'creditor',
                'debtor',
                'article',
                'subsidiaryLedgerAccountId',
                'detailAccountId',
                'dimension1Id',
                'dimension2Id',
                'dimension3Id'
            )
                .from('journalLines')
                .where('branchId', this.branchId)
                .where('journalId', journalId)),
            journal = await(knex.select()
                .from('journals')
                .where('branchId', this.branchId)
                .andWhere('id', journalId)
                .first());

        journal.journalLines = journalLines;

        return journal;
    }

    getAll(fiscalPeriodId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,
            extra = (parameters.extra) ? parameters.extra : undefined;

        let query = knex.select().from(function () {
            this.select(
                'id',
                'number',
                'date',
                'description',
                'journalStatus',
                knex.raw('sum("debtor") as "sumDebtor"'),
                knex.raw('sum("creditor") as "sumCreditor"')
            )
                .from(function () {
                    journalBase.call(this, knex, {
                        numberFieldName: 'temporaryNumber',
                        dateFieldName: 'temporaryDate',
                        branchId
                    });

                    journalBaseFilter(this, extra, fiscalPeriodId, knex);
                })
                .groupBy(
                    'id',
                    'number',
                    'date',
                    'description',
                    'journalStatus')
                .as('base');

        });

        return await(kendoQueryResolve(query, parameters, view));
    }

    getGroupedByMouth(currentFiscalPeriod) {
        let knex = this.knex,
            branchId = this.branchId;

        let selectExp = '"month",' +
            '"count"(*) as "count",' +
            '"min"("temporaryNumber") as "minNumber",' +
            '"max"("temporaryNumber") as "maxNumber",' +
            '"min"("temporaryDate") as "minDate",' +
            '"max"("temporaryDate") as "maxDate"';

        let query = knex.select(knex.raw(selectExp)).from(function () {
            this.select(knex.raw('*,cast(substring("temporaryDate" from 6 for 2) as INTEGER) as "month"'))
                .from('journals')
                .where('branchId', branchId)
                .andWhere('periodId', currentFiscalPeriod)
                .as('baseJournals');
        })
            .as('baseJournals')
            .groupBy('month')
            .orderBy('month');

        let result = await(query);

        result.forEach(item => item.monthName = enums.getMonth().getDisplay(item.month));

        return {data: result};
    }

    getJournalsByMonth(month, currentFiscalPeriod, parameters) {
        let knex = this.knex,
            branchId = this.branchId;

        let selectExp = '"id","temporaryNumber","temporaryDate","number","date","description",' +
            'CASE WHEN "journalStatus"=\'Fixed\' THEN TRUE ELSE FALSE END as "isFixed",' +
            'CASE WHEN "attachmentFileName" IS NOT NULL THEN TRUE ELSE FALSE END as "hasAttachment",' +
            '(select "sum"("debtor") from "journalLines" WHERE "journalId" = journals."id") as "sumAmount",' +
            '(select "count"(*) from "journalLines" WHERE "journalId" = journals."id") as "countOfRows"';

        let query = knex.select().from(function () {
            this.select(knex.raw(selectExp)).from('journals')
                .where('branchId', branchId)
                .andWhere(knex.raw('cast(substring("temporaryDate" from 6 for 2) as INTEGER)'), month)
                .andWhere('periodId', currentFiscalPeriod)
                .orderBy('temporaryNumber')
                .as('baseJournals');
        });

        return kendoQueryResolve(query, parameters, e => e);
    }

    getAllByPeriod(currentFiscalPeriod, parameters) {
        let branchId = this.branchId,
            query = this.knex.select().from(function () {
                this.select().from('journals')
                    .where('branchId', branchId)
                    .andWhere('periodId', currentFiscalPeriod)
                    .orderBy('temporaryNumber', 'desc')
                    .as('baseJournals');
            }).as('baseJournals');

        return kendoQueryResolve(query, parameters, view)
    }

    getById(id) {
        let knex = this.knex,
            journalLines = await(knex.select(
                'id',
                'row',
                'creditor',
                'debtor',
                'article',
                'subsidiaryLedgerAccountId',
                'detailAccountId',
                'dimension1Id',
                'dimension2Id',
                'dimension3Id'
            )
                .from('journalLines')
                .where('branchId', this.branchId)
                .where('journalId', id)),
            journal = await(knex.select()
                .from('journals')
                .where('branchId', this.branchId)
                .andWhere('id', id)
                .first());

        journal.journalLines = journalLines;

        return view(journal);
    }

    getByNumber(currentFiscalPeriodId, number) {
        return this.knex.select('*').from('journals')
            .where('branchId', this.branchId)
            .andWhere('periodId', currentFiscalPeriodId)
            .andWhere('temporaryNumber', number)
            .first();
    }

    getTotalInfo(currentFiscalPeriod) {
        let knex = this.knex,
            base = knex.from('journals')
                .where('branchId', this.branchId)
                .andWhere('periodId', currentFiscalPeriod),

            lastNumber = await(base.max('temporaryNumber')
                .first()).max,
            totalFixed = await(base.where('journalStatus', 'Fixed')
                .select(knex.raw('count(*)'))
                .first()).count,
            totalInComplete = await(base.where('isInComplete', true)
                .select(knex.raw('count(*)')).first()).count;

        return {lastNumber, totalFixed, totalInComplete};
    }

    getPayablesNotHaveChequeLines(currentFiscalPeriodId, detailAccountId, parameters) {
        let knex = this.knex,
            branchId = this.branchId,

            query = knex.select()
                .from(function () {
                    this.select(
                        'journalBase.id',
                        'temporaryNumber',
                        'temporaryDate',
                        'article',
                        'debtor',
                        'creditor',
                        'subsidiaryLedgerAccounts.code',
                        'subsidiaryLedgerAccounts.title'
                    )
                        .from(function () {
                            base.call(this);
                        })
                        .leftJoin('subsidiaryLedgerAccounts', 'journalBase.subsidiaryLedgerAccountId', 'subsidiaryLedgerAccounts.id')
                        .andWhere('subsidiaryLedgerAccounts.isBankAccount', true)
                        .as('secondLevel')
                });


        function base() {
            this.select(
                'journalLines.id',
                'temporaryNumber',
                'temporaryDate',
                'article',
                'debtor',
                'creditor',
                'subsidiaryLedgerAccountId')
                .from('journals')
                .leftJoin('journalLines', 'journals.id', 'journalLines.journalId')
                .leftJoin('cheques', 'journalLines.id', 'cheques.journalLineId')
                .where('branchId', branchId)
                .andWhere('periodId', currentFiscalPeriodId)
                .whereNull('cheques.journalLineId')
                .andWhere('detailAccountId', detailAccountId)
                .andWhere('creditor', '>', 0)
                .as('journalBase')
        }

        return kendoQueryResolve(query, parameters, item => ({
            id: item.id,
            number: item.temporaryNumber,
            date: item.temporaryDate,
            article: item.article,
            debtor: item.debtor,
            creditor: item.creditor,
            subsidiaryLedgerAccountDisplay: `${item.code} ${item.title}`
        }));

    }
}

module.exports = JournalQuery;



