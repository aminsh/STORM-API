"use strict";

const BaseQuery = require('../queries/query.base'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    Enums = instanceOf('Enums');

class ReportFilterConfig extends BaseQuery {
    constructor(branchId, currentFiscalPeriodId, mode, filter) {
        super(branchId);
        this.currentFiscalPeriodId = currentFiscalPeriodId;
        this.mode = mode; //for temporaryDate and temporaryNumber in journals
        this.filter = filter;

        this.getDateOptions = async(this.getDateOptions);
        this.getDateRange = async(this.getDateRange);
    };

    executeFilter(query){
        let filter = this.filter,
            currentFiscalPeriod = this.currentFiscalPeriodId;

        if (!filter)
            return query.where('periodId', currentFiscalPeriod);

        if (!filter.isNotPeriodIncluded)
            query.where('periodId', currentFiscalPeriod);

        if (filter.minNumber && filter.maxNumber)
            query.andWhereBetween('number', [filter.minNumber, filter.maxNumber]);

        if (filter.generalLedgerAccounts && filter.generalLedgerAccounts.length > 0)
            query.whereIn('generalLedgerAccountId', filter.generalLedgerAccounts);

        if (filter.subsidiaryLedgerAccounts && filter.subsidiaryLedgerAccounts.length > 0)
            query.whereIn('subsidiaryLedgerAccountId', filter.subsidiaryLedgerAccounts);

        if (filter.detailAccounts && filter.detailAccounts.length > 0)
            query.whereIn('detailAccountId', filter.detailAccounts);

        if (filter.generalLedgerAccountId)
            query.andWhere('generalLedgerAccountId', filter.generalLedgerAccountId);

        if (filter.subsidiaryLedgerAccountId)
            query.andWhere('subsidiaryLedgerAccountId', filter.subsidiaryLedgerAccountId);

        if (filter.detailAccountId)
            query.andWhere('detailAccountId', filter.detailAccountId);
    }

    getDateOptions() {
        let dateRange = await(this.getDateRange()),
            mode = this.mode,
            month = this.getMonth(),
            season = this.getSeason();
        return {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
            fromMainDate: dateRange.fromMainDate,
            filter: this.filter,
            dateFieldName: mode == 'create' ? 'temporaryDate' : 'date',
            numberFieldName: mode == 'create' ? 'temporaryNumber' : 'number',
            branchId: this.branchId,
            month: month,
            season: season
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
    };

    getMonth() {
        let filter = this.filter;

        if (!filter.month)
            return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        if (filter.month)
            return [filter.month];

    };

    getSeason() {
        let filter = this.filter;

        if (!filter.season)
            return [1, 2, 3, 4];

        if (filter.season)
            return [filter.season];
    }
}

module.exports = ReportFilterConfig;