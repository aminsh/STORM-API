import {inject, injectable} from "inversify";
import Enumerable from "linq";


@injectable()
export class ReportConfig {

    @inject("State")
    /**@type{IState}*/ state = undefined;

    @inject("FiscalPeriodQuery")
    /**@type{FiscalPeriodQuery}*/ fiscalPeriodQuery = undefined;

    get filter() {

        const parameters = this.state.request.query;

        return (parameters.extra) ? parameters.extra.filter : {}
    }

    get options() {
        let dateRange = this._getDateRange(),
            mode = 'create',
            month = this._getMonth(),
            season = this._getSeason();
        return {
            fromDate: dateRange.fromDate,
            toDate: dateRange.toDate,
            fromMainDate: dateRange.fromMainDate,
            filter: this.filter,
            dateFieldName: mode === 'create' ? 'temporaryDate' : 'date',
            numberFieldName: mode === 'create' ? 'temporaryNumber' : 'number',
            branchId: this.state.branchId,
            month: month,
            season: season
        };
    }

    _getDateRange() {
        const currentPeriod = this.fiscalPeriodQuery.getById(this.state.fiscalPeriodId);
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

    _getMonth() {
        let filter = this.filter;

        if (!filter.month)
            return Enumerable.range(1,12).toArray();

        if (filter.month)
            return (Array.isArray(filter.month) ? filter.month : [filter.month])
                .asEnumerable()
                .select(parseInt).toArray();

    };

    _getSeason() {
        let filter = this.filter;

        if (!filter.season)
            return Enumerable.range(1,4).toArray();

        if (filter.season)
            return (Array.isArray(filter.season) ? filter.season : [filter.season])
                .asEnumerable()
                .select(parseInt).toArray();
    }

}