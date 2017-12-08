"use strict";

import domtoimage from 'dom-to-image';

export default class ReportPrintController {
    constructor($scope,
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

    refresh() {
        let report = this.report;

        if (!report.params)
            return this.navigate('^.print', {key: report.key});

        if (report.params.lenght == 0)
            return this.navigate('^.print', {key: report.key});

        this.reportParameters.show(report.params)
            .then(params =>
                this.navigate('^.print', {key: this.report.key}, params))
    }

    toJpeg() {
        domtoimage.toJpeg(document.getElementsByClassName('stiJsViewerPageShadow')[0], {quality: 0.95})
            .then(function (dataUrl) {
                const link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
    }
}