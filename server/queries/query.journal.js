"use strict";

const async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    BaseQuery = require('./query.base'),
    kendoQueryResolve = require('../services/kendoQueryResolve'),
    view = require('../viewModel.assemblers/view.journal'),
    enums = require('../constants/enums'),
    groupedJournals = require('./query.journal.grouped');

module.exports = class JournalQuery extends BaseQuery {
    constructor(knex) {
        super(knex);
        this.getGroupedByMouth = async(this.getGroupedByMouth);
        this.getById = async(this.getById);
    }

    getAll(fiscalPeriodId, parameters) {
        let knex = this.knex;

        let extra = (parameters.extra) ? parameters.extra.filter : undefined;

        let query = knex.select()
            .from(() => groupedJournals.call(this, extra, fiscalPeriodId))
            .as('baseJournals');

        return kendoQueryResolve(query, parameters, view);
    }

    getGroupedByMouth(currentFiscalPeriod) {
        let knex = this.knex;

        let selectExp = '"month",' +
            '"count"(*) as "count",' +
            '"min"("temporaryNumber") as "minNumber",' +
            '"max"("temporaryNumber") as "maxNumber",' +
            '"min"("temporaryDate") as "minDate",' +
            '"max"("temporaryDate") as "maxDate"';

        let query = knex.select(knex.raw(selectExp)).from(function () {
                this.select(knex.raw('*,cast(substring("temporaryDate" from 6 for 2) as INTEGER) as "month"'))
                    .from('journals')
                    .where('periodId', currentFiscalPeriod)
                    .as('baseJournals');
            })
            .as('baseJournals')
            .groupBy('month')
            .orderBy('month');

        let result = await(query);

        result.forEach(item => item.monthName = enums.getMonth().getDisplay(item.month));

        return result;
    }

    getJournalsByMonth(month, currentFiscalPeriod, parameters) {
        let knex = this.knex;

        let selectExp = '"id","temporaryNumber","temporaryDate","number","date","description",' +
            'CASE WHEN "journalStatus"=\'Fixed\' THEN TRUE ELSE FALSE END as "isFixed",' +
            'CASE WHEN "attachmentFileName" IS NOT NULL THEN TRUE ELSE FALSE END as "hasAttachment",' +
            '(select "sum"("debtor") from "journalLines" WHERE "journalId" = journals."id") as "sumAmount",' +
            '(select "count"(*) from "journalLines" WHERE "journalId" = journals."id") as "countOfRows"';

        let query = knex.select().from(function () {
            this.select(knex.raw(selectExp)).from('journals')
                .where(knex.raw('cast(substring("temporaryDate" from 6 for 2) as INTEGER)'), month)
                .andWhere('periodId', currentFiscalPeriod)
                .orderBy('temporaryNumber')
                .as('baseJournals');
        });

        return kendoQueryResolve(query, parameters, e => e);
    }

    getAllByPeriod(currentFiscalPeriod, parameters) {
        let query = this.knex.select().from(function () {
            this.select().from('journals')
                .where('periodId', currentFiscalPeriod)
                .orderBy('temporaryNumber', 'desc')
                .as('baseJournals');
        }).as('baseJournals');

        kendoQueryResolve(query, parameters, view)
    }

    getById(id) {
        let knex = this.knex;
        let result = await(knex.select().from('journals').where('id', id).first());

        result.tagIds = await(knex.select('tagId')
            .from('journalTags')
            .where('journalId', id)
            .map(t => t.tagId)
            .toArray());

        return view(result);
    }
};



