"use strict";

const BaseQuery = require('./query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

module.exports = class JournalQueryConfig extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);
        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode;
        this.filter = filter;

        this.getOptions = async(this.getOptions);
        this.getDateRange = async(this.getDateRange);
    };

    getOptions() {
        let dateRange = await(this.getDateRange()),
            mode = this.mode || 'create';
        return {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
            fromMainDate: dateRange.fromMainDate,
            filter: this.filter,
            dateFieldName: mode == 'create' ? 'temporaryDate' : 'date',
            numberFieldName: mode == 'create' ? 'temporaryNumber' : 'number',
            branchId: this.branchId
        };
    }

    getDateRange() {
        let fiscalPeriodId = this.currentFiscalPeriodId;
        let currentPeriod = await(this.knex.select()
            .from('fiscalPeriods')
            .where('id', fiscalPeriodId).first()),
            filter = this.filter;

        if (!eval(filter.isNotPeriodIncluded))
            return {
                fromDate: currentPeriod.minDate,
                fromMainDate: (filter.minDate && filter.minDate >= currentPeriod.minDate)
                    ? filter.minDate
                    : currentPeriod.minDate,
                toDate: (filter.maxDate && filter.maxDate <= currentPeriod.maxDate)
                    ? filter.maxDate
                    : "9999/99/99"
            };

        if (!(filter.minDate && filter.maxDate))
            return {
                fromDate: "0",
                fromMainDate: "0",
                toDate: "9999/99/99"
            };

        return {
            fromDate: "0",
            fromMainDate: filter.minDate,
            toDate: filter.maxDate
        };
    }
};