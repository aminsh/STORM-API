import accModule from '../acc.module';


function reportViewer() {
    return {
        restrict: 'E',
        template: '<div id="contentViewer" style="direction: ltr"></div>',
        scope: {
            reportData: '=',
            reportFileName: '@',
            reportDataSourceName: '@'
        },
        link: function (scope, element, attrs) {
            let options = new Stimulsoft.Viewer.StiViewerOptions();

            options.toolbar.fontFamily = "IRANSans";
            options.toolbar.showDesignButton = true;
            options.toolbar.printDestination = Stimulsoft.Viewer.StiPrintDestination.Pdf;
            options.appearance.htmlRenderMode = Stimulsoft.Report.Export.StiHtmlExportMode.Table;

            let report = new Stimulsoft.Report.StiReport();
            let viewer = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);

            report.loadFile(`/client/reportFiles/${scope.reportFileName}`);
            viewer.renderHtml("contentViewer");

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

            let data = {};
            data[scope.reportDataSourceName] = scope.reportData;

            report.regData("data", "data", data);
            viewer.report = report;
        }
    };
}

accModule.directive('devTagReportViewer', reportViewer);