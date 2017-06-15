"use strict";

export default class {
    constructor($scope,
                devConstants,
                reportParameters,
                navigate) {

        $scope.$emit('close-sidebar');

        this.reports = devConstants.reports.asEnumerable()
            .where(r => [undefined, true].includes(r.showOnAccounting))
            .toArray();
        this.reportParameters = reportParameters;
        this.navigate = navigate;
    }

    show(report) {
        if (!report.params)
            return this.navigate('^.print', {key: report.key});

        if (report.params.lenght == 0)
            return this.navigate('^.print', {key: report.key});

        this.reportParameters.show(report.params)
            .then(params => this.navigate(
                '^.print',
                {key: report.key},
                params));
    }

    design(report) {
        if (!report.params)
            return this.navigate('^.design', {key: report.key});

        if (report.params.lenght == 0)
            return this.navigate('^.design', {key: report.key});

        this.reportParameters.show(report.params)
            .then(params => this.navigate(
                '^.design',
                {key: report.key},
                params));
    }
}