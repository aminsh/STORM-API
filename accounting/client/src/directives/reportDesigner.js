import accModule from '../acc.module';
import {addVariable} from '../utilities/stimulsoft';


function reportDesigner(currentService, reportApi) {
    return {
        restrict: 'E',
        template: '<div id="contentDesigner" style="direction: ltr"></div>',
        scope: {
            reportData: '=',
            reportFileName: '@',
            reportDataSourceName: '@',
            reportTitle: '@'
        },
        link: (scope, element, attrs) => {
            let report = new Stimulsoft.Report.StiReport(),
                designer = new Stimulsoft.Designer.StiDesigner(null, 'StiDesigner', false),
                current = currentService.get(),
                data = {};

            if (scope.reportFileName)
                report.loadFile(`/luca/client/reportFiles/${scope.reportFileName}`);

            designer.renderHtml("contentDesigner");

            designer.onSaveReport = e => {
                e.preventDefault = true;

                let jsonReport = e.report.saveToJsonString();
                reportApi.save({fileName: e.fileName, data: jsonReport});
            };

            report.dictionary.variables.add(addVariable({
                name: 'today',
                alias: 'Today',
                category: 'general',
                value: '1395/01/01',
            }));


            report.dictionary.variables.add(addVariable({
                name: 'currentUser',
                alias: 'Current user',
                category: 'general',
                value: current.user.name
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchLogo',
                alias: 'Branch Logo',
                category: "general",
                value: current.branch.logo
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchTitle',
                alias: 'Branch title',
                category: "general",
                value: current.branch.title
            }));

            report.dictionary.variables.add(addVariable({
                name: 'reportTitle',
                alias: 'Report title',
                category: "general",
                value: scope.reportTitle
            }));

            report.dictionary.variables.add(addVariable({
                name: 'reportParameters',
                alias: 'Report parameters',
                category: "general",
                value: scope.reportParameters
            }));

            data[scope.reportDataSourceName] = scope.reportData;

            report.regData("data", "data", data);
            report.dictionary.synchronize();
            designer.report = report;
        }
    };
}

accModule.directive('devTagReportDesigner', reportDesigner);