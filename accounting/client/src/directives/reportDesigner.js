import accModule from '../acc.module';
import {addVariable} from '../utilities/stimulsoft';


function reportDesigner(reportApi, $rootScope) {
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
                data = {};

            if (scope.reportFileName)
                report.loadFile(`/acc/reporting/files/${scope.reportFileName}`);

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
                value: $rootScope.user.name
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchLogo',
                alias: 'Branch Logo',
                category: "general",
                value: $rootScope.branch.logo
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchPostalCode',
                alias: 'Branch postalCode',
                category: "general",
                value: $rootScope.branch.postalCode
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchNationalCode',
                alias: 'Branch nationalCode',
                category: "general",
                value: $rootScope.branch.nationalCode
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchPhone',
                alias: 'Branch Phone',
                category: "general",
                value: $rootScope.branch.phone
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchMobile',
                alias: 'Branch Mobile',
                category: "general",
                value: $rootScope.branch.phone
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchAddress',
                alias: 'Branch address',
                category: "general",
                value: $rootScope.branch.address
            }));

            report.dictionary.variables.add(addVariable({
                name: 'branchTitle',
                alias: 'Branch title',
                category: "general",
                value: $rootScope.branch.title
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