import accModule from '../acc.module';
import Guid from 'guid';
import {viewerConfig, addVariable, addTranslates} from '../utilities/stimulsoft';

let config = viewerConfig();


function reportViewer(currentService) {
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
            let id = Guid.new(),
                data = {},
                current = currentService.get(),
                report = new Stimulsoft.Report.StiReport(),
                viewer = new Stimulsoft.Viewer.StiViewer(config, "StiViewer" + id, false);

            $(element).find('div').attr('id', id);

            report.loadFile(`/acc/api/reports/file/${scope.reportFileName}`);
            viewer.renderHtml(id);

            report.dictionary.variables.add(addVariable({
                name: 'today',
                alias: 'Today',
                category: "general",
                value: current.today
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
                value: current.branch.name
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

            addTranslates(report);

            data[scope.reportDataSourceName] = scope.reportData;

            report.regData("data", "data", data);
            viewer.report = report;
        }
    };
}

accModule.directive('devTagReportViewer', reportViewer);