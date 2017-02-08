import accModule from '../acc.module';


function reportDesigner(currentService, reportApi, $window) {
    return {
        restrict: 'E',
        template: '<div id="contentDesigner" style="direction: ltr"></div>',
        scope: {
            reportData: '=',
            reportFileName: '@',
            reportDataSourceName: '@'
        },
        link: (scope, element, attrs) => {
            let report = new Stimulsoft.Report.StiReport();

            if (scope.reportFileName)
                report.loadFile(`/client/reportFiles/${scope.reportFileName}`);
            else {
                report.loadFile(`/client/reportFiles/reportTemplate`);
                report.reportFile = ""
            }

            let designer = new Stimulsoft.Designer.StiDesigner(null, 'StiDesigner', false);

            designer.onSaveReport = e => {
                e.preventDefault = true;

                let jsonReport = e.report.saveToJsonString();
                reportApi.save({fileName: e.fileName, data: jsonReport});
            };

            designer.renderHtml("contentDesigner");

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

            let logo = new Stimulsoft.Report.Dictionary.StiVariable();
            logo.name = 'logo';
            logo.alias = 'logo';
            logo.category = "general";
            logo.value = currentService.get().branch.logo;

            report.dictionary.variables.add(logo);

            let title = new Stimulsoft.Report.Dictionary.StiVariable();
            title.name = 'title';
            title.alias = 'title';
            title.category = "general";
            title.value = currentService.get().branch.name;

            report.dictionary.variables.add(title);

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
            report.dictionary.synchronize();
            designer.report = report;
        }
    };
}

accModule.directive('devTagReportDesigner', reportDesigner);