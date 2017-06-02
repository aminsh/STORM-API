"use strict";

export default class ReportDesignController {
    constructor(
        $scope,
        devConstants,
        $stateParams,
        $location,
        reportApi) {

        $scope.$emit('close-sidebar');

        let report = this.report = devConstants.reports.asEnumerable()
            .selectMany(r => r.items)
            .single(r => r.key == $stateParams.key),

            params = $location.search();

        this.data = false;

        reportApi[report.func](params)
            .then(result => this.data = result);
    }
}