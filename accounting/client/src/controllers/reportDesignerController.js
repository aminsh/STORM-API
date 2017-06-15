"use strict";

export default class ReportDesignController {
    constructor(
        $scope,
        devConstants,
        $stateParams,
        navigate,
        $location,
        reportApi,
        reportParameters) {

        $scope.$emit('close-sidebar');

        let report = this.report = devConstants.reports.asEnumerable()
                .selectMany(r => r.items)
                .single(r => r.key == $stateParams.key),

            params = $location.search();

        this.navigate = navigate;
        this.reportParameters = reportParameters;
        this.data = false;

        reportApi[report.func](params)
            .then(result => this.data = result);
    }
}