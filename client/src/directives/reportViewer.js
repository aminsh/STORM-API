import accModule from '../acc.module';
import Guid from 'dev.guid';


function reportViewer() {
    return {
        restrict: 'E',
        template: '<div id="contentViewer" style="direction: ltr"></div>',
        scope: {
            reportData: '=',
            reportFileName: '@',
            reportTitle: '@',
            reportParameters: '@',
            reportDataSourceName: '@'
        },
        link: function (scope, element, attrs) {
            let id = Guid.new();

            $(element).find('div').attr('id', id);

            let options = new Stimulsoft.Viewer.StiViewerOptions();

            options.toolbar.fontFamily = "IRANSans";
            options.toolbar.showDesignButton = true;
            options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Pdf;
            options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;

            let report = new Stimulsoft.Report.StiReport();
            let viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer" + id, false);

            report.loadFile(`/client/reportFiles/${scope.reportFileName}`);
            viewer.renderHtml(id);

            let today = new Stimulsoft.Report.Dictionary.StiVariable();
            today.name = 'today';
            today.alias = 'Today';
            today.category = "general";
            today.value = '1395/01/01';

            report.dictionary.variables.add(today);

            let user = new Stimulsoft.Report.Dictionary.StiVariable();
            user.name = 'user';
            user.alias = 'User';
            user.category = "general";
            user.value = localStorage.getItem('currentUser');

            report.dictionary.variables.add(user);

            let reportTitle = new Stimulsoft.Report.Dictionary.StiVariable();
            reportTitle.name = 'reportTitle';
            reportTitle.alias = 'Report title';
            reportTitle.category = "general";
            reportTitle.value = scope.reportTitle;

            report.dictionary.variables.add(reportTitle);

            let reportParameters = new Stimulsoft.Report.Dictionary.StiVariable();
            reportParameters.name = 'reportParameters';
            reportParameters.alias = 'Report parameters';
            reportParameters.category = "general";
            reportParameters.value = scope.reportParameters;

            report.dictionary.variables.add(reportParameters);

            let data = {};
            data[scope.reportDataSourceName] = scope.reportData;

            report.regData("data", "data", data);
            viewer.report = report;
        }
    };
}

accModule.directive('devTagReportViewer', reportViewer);