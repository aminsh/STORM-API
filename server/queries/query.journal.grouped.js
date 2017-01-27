"use strict";

const baseJournals = require('./query.journal.base');

module.exports = function (extra, currentFiscalPeriodId, knex) {
    this.select(
        'id',
        'temporaryNumber',
        'temporaryDate',
        'number',
        'date',
        'description',
        'periodId',
        'createdById',
        'journalStatus',
        'journalType',
        'isInComplete'
    ).from(function () {
            baseJournals.call(this, extra, currentFiscalPeriodId, knex)
        })
        .groupBy(
            'id',
            'temporaryNumber',
            'temporaryDate',
            'number',
            'date',
            'description',
            'periodId',
            'createdById',
            'journalStatus',
            'journalType',
            'isInComplete')
        .as('groupedJournals');
};