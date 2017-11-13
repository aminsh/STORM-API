"use strict";

const BaseQuery = require('../queries/query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await');

class ReportFilterConfig extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);
        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode; //for temporaryDate and temporaryNumber in journals
        this.filter = filter;

        this.getOptions = async(this.getOptions);
        this.getDateRange = async(this.getDateRange);
    };

    getOptions() {
        let dateRange = await(this.getDateRange()),
            mode = this.mode;
        return {
            fromDate: dateRange.fromMainDate,
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
                    : currentPeriod.maxDate
            };

        if (!(filter.minDate && filter.maxDate)
            || filter.minDate < currentPeriod.minDate
            || filter.maxDate > currentPeriod.maxDate)
            return {
                fromDate:  currentPeriod.minDate,
                fromMainDate: currentPeriod.minDate,
                toDate: currentPeriod.maxDate
            };

        return {
            fromDate: "0",
            fromMainDate: filter.minDate,
            toDate: filter.maxDate
        };
    }
}

module.exports =  ReportFilterConfig;