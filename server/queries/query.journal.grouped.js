"use strict";

const baseJournals = require('./query.journal.base');

module.exports = function (extra, currentFiscalPeriodId) {
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
    ).from(() => baseJournals.call(this, extra, currentFiscalPeriodId))
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